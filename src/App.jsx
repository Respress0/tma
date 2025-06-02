// App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
