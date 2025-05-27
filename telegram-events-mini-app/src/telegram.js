// src/telegram.js
export const tg = window.Telegram.WebApp;

export const initTelegram = () => {
  tg.ready();
  tg.expand(); // Разворачивает окно по максимуму
};

export const getTelegramUser = () => {
  return tg.initDataUnsafe?.user;
};
