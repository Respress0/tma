// src/components/Sidebar.tsx
import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li><a href="#" className="hover:text-gray-300">Главная</a></li>
          <li><a href="#" className="hover:text-gray-300">Аналитика</a></li>
          <li><a href="#" className="hover:text-gray-300">Настройки</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
