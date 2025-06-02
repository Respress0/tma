import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  if (!user) {
    return <div className="p-4 text-center text-gray-500">Загрузка профиля...</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center text-center">
      <img
        src={user.photo_url}
        alt="Avatar"
        className="w-24 h-24 rounded-full shadow mb-4"
      />
      <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
      <p className="text-gray-600">@{user.username}</p>
    </div>
  );
}
