// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getTelegramUser } from "../telegram";
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getTelegramUser());
  }, []);

  return (
    <div className="min-h-screen bg-pastelYellow flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-pastelPink rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-pastelPurple">
          Добро пожаловать{user ? `, ${user.first_name}` : ""}!
        </h1>
        <p className="mb-6 text-gray-700 text-lg">
          Выберите мероприятие или создайте своё
        </p>

        <div className="space-y-4">
          <Link to="/create">
            <button className="w-full py-3 rounded-xl bg-pastelBlue text-white font-semibold hover:bg-blue-400 transition">
              Создать мероприятие
            </button>
          </Link>
          <Link to="/event/1">
            <button className="w-full py-3 rounded-xl bg-pastelGreen text-gray-800 font-semibold hover:bg-green-300 transition">
              Смотреть мероприятие
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
