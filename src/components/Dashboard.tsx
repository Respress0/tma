import React, { useState } from "react";

const Dashboard = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      alert(`Мероприятие "${title}" создано!`);
      setTitle("");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex justify-center items-center px-4">
      <div className="bg-pink-200 rounded-3xl p-6 w-full max-w-sm shadow-md text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Создать <br /> мероприятие
        </h1>

        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-xl text-gray-700 bg-white placeholder-gray-400 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-green-300 text-white rounded-xl font-semibold hover:bg-green-400 transition"
        >
          Создать
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
