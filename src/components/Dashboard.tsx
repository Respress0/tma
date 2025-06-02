// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      {/* Профиль */}
      {user && (
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.photo_url}
            alt="User avatar"
            className="w-24 h-24 rounded-full shadow-md mb-3"
          />
          <h2 className="text-xl font-semibold">
            Привет, {user.first_name} {user.last_name || ""}
          </h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      )}

      {/* Панель */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {[
          { title: "Пользователи", color: "bg-blue-100", icon: "👤" },
          { title: "Продажи", color: "bg-green-100", icon: "💰" },
          { title: "Посещения", color: "bg-purple-100", icon: "👀" },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl shadow hover:shadow-lg transition duration-200 ${item.color}`}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-2xl font-bold">
              {Math.floor(Math.random() * 1000)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
