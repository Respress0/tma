export default function AuthSection({ onAuthClick }) {
  return (
    <div id="auth-section">
      <h1>Добро пожаловать!</h1>
      <p>Пожалуйста, авторизуйтесь через Telegram</p>
      <button
        id="auth-button"
        className="tg-button"
        onClick={onAuthClick}
      >
        Войти через Telegram
      </button>
    </div>
  );
}
