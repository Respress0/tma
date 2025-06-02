import React from "react";
import { useTelegram } from "../hooks/useTelegram";

const Header = () => {
  const { user } = useTelegram();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Главная панель</h1>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.first_name} {user.last_name}</span>
          <img
            src={`https://t.me/i/userpic/320/${user.username}.jpg`}
            alt="avatar"
            className="w-8 h-8 rounded-full border"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}
    </header>
  );
};

export default Header;