import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import BottomMenu from "./components/BottomMenu";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="pb-16">
      {activeTab === "home" && <Dashboard />}
      {activeTab === "search" && (
        <div className="p-6 text-center text-gray-500">Поиск будет позже 🙂</div>
      )}
      {activeTab === "profile" && (
        <div className="p-6 text-center text-gray-500">Профиль будет позже 👤</div>
      )}
      <BottomMenu onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
