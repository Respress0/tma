import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabBar from "./components/TabBar";
import EventList from "./components/EventList";
import CreateEvent from "./components/CreateEvent";
import Account from "./components/Account";
import { logger } from "./utils/logger";

function App() {
  const [activeTab, setActiveTab] = useState("events");
  const [user, setUser] = useState(null);

  useEffect(() => {
    logger.info("Инициализация приложения");
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();

        const userData = {
          id: tg.initDataUnsafe.user?.id,
          firstName: tg.initDataUnsafe.user?.first_name,
          lastName: tg.initDataUnsafe.user?.last_name,
          username: tg.initDataUnsafe.user?.username,
        };

        setUser(userData);
        logger.info("Данные пользователя Telegram получены", userData);
      } else {
        logger.warn(
          "Telegram WebApp не обнаружен, работаем в standalone режиме",
        );
      }
    } catch (error) {
      logger.error("Ошибка при инициализации Telegram WebApp", error);
    }
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<EventList user={user} />} />
          <Route path="/events" element={<EventList user={user} />} />
          <Route path="/create" element={<CreateEvent user={user} />} />
          <Route path="/account" element={<Account user={user} />} />
        </Routes>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Router>
  );
}

export default App;
