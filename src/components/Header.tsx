// src/components/Header.tsx
import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Главная панель</h1>
      <div className="text-sm text-gray-600">Пользователь</div>
    </header>
  );
};

export default Header;

