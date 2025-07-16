import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { logger } from "./utils/logger";

// Обработка неотловленных ошибок
window.onerror = function (message, source, lineno, colno, error) {
  logger.error("Неотловленная ошибка", {
    message,
    source,
    lineno,
    colno,
    error,
  });
  return true; // Предотвращаем вывод ошибки в консоль по умолчанию
};

// Обработка неотловленных promise-ошибок
window.addEventListener("unhandledrejection", (event) => {
  logger.error("Неотловленная ошибка Promise", event.reason);
  event.preventDefault();
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
