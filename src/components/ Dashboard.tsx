// src/components/Dashboard.tsx
import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {["Пользователи", "Продажи", "Посещения"].map((title, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-3xl font-bold">{Math.floor(Math.random() * 1000)}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
