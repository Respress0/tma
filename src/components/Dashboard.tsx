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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-6">
      {user ? (
        <div className="flex flex-col items-center">
          <img
            src={user.photo_url}
            alt="User avatar"
            className="w-24 h-24 rounded-full shadow-md mb-3"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Привет, {user.first_name} {user.last_name || ""}
          </h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Загрузка профиля...</p>
      )}
    </div>
  );
};

export default Dashboard;
