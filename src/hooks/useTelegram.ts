export function useTelegram() {
  const tg = window.Telegram.WebApp;

  const user = tg.initDataUnsafe?.user || {};

  return {
    tg,
    user,
    queryId: tg.initDataUnsafe?.query_id,
  };
}
