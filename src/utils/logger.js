// src/utils/logger.js
export const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Здесь можно добавить отправку ошибок на сервер
    // sendErrorToServer(message, error);
  },
  info: (message) => {
    console.log(`[INFO] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
  },
};
