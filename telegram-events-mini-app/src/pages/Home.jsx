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
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-2">Добро пожаловать{user ? `, ${user.first_name}` : ""}!</h1>
      <p className="mb-4">Выберите мероприятие или создайте своё</p>

      <div className="space-y-2">
        <Link to="/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">Создать мероприятие</button>
        </Link>
        <Link to="/event/1">
          <button className="bg-gray-200 px-4 py-2 rounded-xl w-full">Смотреть мероприятие</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
