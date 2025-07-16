import axios from "axios";
import { logger } from "./logger";

// Мок данные для демонстрации
const mockEvents = [
  {
    id: 1,
    title: "Встреча разработчиков",
    description: "Обсуждение новых технологий и проектов",
    date: "2023-12-15T18:00:00",
    location: "Онлайн",
    organizer: "Иван Петров",
  },
  {
    id: 2,
    title: "Мастер-класс по React",
    description: "Изучение современных подходов в React",
    date: "2023-12-20T15:00:00",
    location: "Коворкинг Центр",
    organizer: "Алексей Сидоров",
  },
];

const mockStats = {
  rating: 4.8,
  totalEvents: 5,
  totalVisitors: 120,
  myEvents: [
    {
      id: 101,
      title: "Первое мероприятие",
      date: "2023-11-10T14:00:00",
      visitors: 25,
    },
    {
      id: 102,
      title: "Второе мероприятие",
      date: "2023-11-25T16:00:00",
      visitors: 18,
    },
  ],
};

// Получение списка мероприятий
export const getEvents = async () => {
  try {
    logger.info("Запрос к API для получения мероприятий");
    // В реальном приложении:
    // const response = await axios.get('https://api.example.com/events');
    // return response.data;

    // Мок реализация
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info("Мероприятия успешно получены", mockEvents);
        resolve(mockEvents);
      }, 500);
    });
  } catch (error) {
    logger.error("Ошибка при получении мероприятий", error);
    throw error;
  }
};

// Создание нового мероприятия
export const createEvent = async (eventData) => {
  try {
    logger.info("Отправка данных нового мероприятия", eventData);
    // В реальном приложении:
    // const response = await axios.post('https://api.example.com/events', eventData);
    // return response.data;

    // Мок реализация
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          ...eventData,
          id: Math.floor(Math.random() * 1000),
          visitors: 0,
        };
        mockEvents.unshift(newEvent);
        logger.info("Мероприятие успешно создано", newEvent);
        resolve(newEvent);
      }, 500);
    });
  } catch (error) {
    logger.error("Ошибка при создании мероприятия", error);
    throw error;
  }
};

// Получение статистики пользователя
export const getUserStats = async (userId) => {
  try {
    logger.info(`Запрос статистики для пользователя ${userId}`);
    // В реальном приложении:
    // const response = await axios.get(`https://api.example.com/users/${userId}/stats`);
    // return response.data;

    // Мок реализация
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info("Статистика пользователя получена", mockStats);
        resolve(mockStats);
      }, 500);
    });
  } catch (error) {
    logger.error("Ошибка при получении статистики пользователя", error);
    throw error;
  }
};

// Дополнительные функции API могут быть добавлены здесь
