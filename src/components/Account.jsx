import { useEffect, useState } from 'react';
import { getUserStats } from '../utils/api';

const Account = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats(user?.id);
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Мой аккаунт</h2>
      {user ? (
        <div>
          <p>Привет, {user.firstName} {user.lastName}</p>
          <p>Username: @{user.username}</p>

          {stats ? (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3>Статистика</h3>
                <p>Рейтинг: {stats.rating}</p>
                <p>Всего мероприятий: {stats.totalEvents}</p>
                <p>Посетителей: {stats.totalVisitors}</p>
              </div>
              <div>
                <h3>Мои мероприятия</h3>
                {stats.myEvents.length === 0 ? (
                  <p>Вы еще не создали мероприятий</p>
                ) : (
                  <div>
                    {stats.myEvents.map(event => (
                      <div key={event.id} className="event-card">
                        <h4>{event.title}</h4>
                        <p>Дата: {new Date(event.date).toLocaleDateString()}</p>
                        <p>Посетителей: {event.visitors}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>Не удалось загрузить статистику</p>
          )}
        </div>
      ) : (
        <p>Пользователь не авторизован</p>
      )}
    </div>
  );
};

export default Account;
