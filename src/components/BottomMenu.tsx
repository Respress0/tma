// src/components/BottomMenu.tsx
import React, { useState } from "react";
import { Home, Search, User } from "lucide-react";

const BottomMenu = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Домой", icon: <Home size={24} /> },
    { id: "search", label: "Поиск", icon: <Search size={24} /> },
    { id: "profile", label: "Профиль", icon: <User size={24} /> },
  ];

  const handleClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex flex-col items-center text-xs ${
            activeTab === tab.id ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => handleClick(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomMenu;
