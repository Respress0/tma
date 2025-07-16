import { useEffect, useState } from "react";
import { getEvents } from "../utils/api";
import { logger } from "../utils/logger";

const EventList = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.info("Загрузка списка мероприятий");
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
        logger.info(`Успешно загружено ${data.length} мероприятий`);
      } catch (error) {
        logger.error("Ошибка при загрузке мероприятий", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    logger.info("Отображаем индикатор загрузки");
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Лента мероприятий</h2>
      {events.length === 0 ? (
        <p>Нет доступных мероприятий</p>
      ) : (
        <div>
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3 className="event-title">{event.title}</h3>
              <p>{event.description}</p>
              <div className="event-meta">
                <p>Дата: {new Date(event.date).toLocaleDateString()}</p>
                <p>Место: {event.location}</p>
                <p>Организатор: {event.organizer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
