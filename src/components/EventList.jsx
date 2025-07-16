import { useEffect, useState } from "react";
import { getEvents } from "../utils/api";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Лента мероприятий</h2>
      {events.length === 0 ? (
        <p>Нет доступных мероприятий</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li
              key={event.id}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Дата: {new Date(event.date).toLocaleDateString()}</p>
              <p>Место: {event.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
