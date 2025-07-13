import { useState, useEffect } from "react";
import AuthSection from "../components/AuthSection";
import ProfileSection from "../components/ProfileSection";
import LoadingSection from "../components/LoadingSection";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [view, setView] = useState("loading");
  const [tg, setTg] = useState(null);
  const [userData, setUserData] = useState(null);

  // Добавим проверку переменных окружения
  useEffect(() => {
    console.log("Проверка переменных окружения:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        setTg(tg);
        tg.expand();
        initApp(tg);
      } else {
        setView("auth");
      }
    }
  }, []);

  async function initApp(tg) {
    try {
      if (tg.initDataUnsafe?.user) {
        await handleTelegramAuth(tg.initDataUnsafe.user);
        setView("profile");
      } else {
        setView("auth");
      }
    } catch (error) {
      console.error("Init error:", error);
      setView("auth");
    }
  }

  async function handleTelegramAuth(tgUser) {
    try {
      // Проверка подключения к Supabase
      if (!supabase) {
        throw new Error("Supabase client не инициализирован");
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", tgUser.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      const userData = {
        telegram_id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name || "",
        username: tgUser.username || "",
        language_code: tgUser.language_code || "ru",
        is_bot: tgUser.is_bot || false,
        last_login: new Date().toISOString(),
        photo_url: tgUser.photo_url || null,
      };

      if (!user) {
        const { error: insertError } = await supabase
          .from("users")
          .insert([userData]);
        if (insertError) throw insertError;
      } else {
        await supabase
          .from("users")
          .update({ last_login: userData.last_login })
          .eq("telegram_id", tgUser.id);
      }

      setUserData(tgUser);
    } catch (error) {
      console.error("Auth error:", error);
      setView("auth");
    }
  }

  function handleAuthClick() {
    if (tg?.initDataUnsafe?.bot?.username) {
      tg.openTelegramLink(
        `https://t.me/${tg.initDataUnsafe.bot.username}?start=webapp`,
      );
    } else {
      alert("Ошибка авторизации. Попробуйте позже.");
    }
  }

  function handleLogout() {
    setView("auth");
  }

  return (
    <div className="container">
      {view === "loading" && <LoadingSection />}
      {view === "auth" && <AuthSection onAuthClick={handleAuthClick} />}
      {view === "profile" && (
        <ProfileSection user={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}
