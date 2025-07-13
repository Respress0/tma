export default function ProfileSection({ user, onLogout }) {
  return (
    <div id="profile-section">
      <h1>Ваш профиль</h1>
      <div className="profile-info">
        <img
          id="user-avatar"
          src={user?.photo_url || 'https://via.placeholder.com/100'}
          alt="Аватар"
          className="avatar"
        />
        <h2 id="user-name">
          {user ? `${user.first_name} ${user.last_name || ''}`.trim() : ''}
        </h2>
        <p id="user-username">
          {user?.username ? `@${user.username}` : ''}
        </p>
      </div>
      <button
        id="logout-button"
        className="tg-button logout"
        onClick={onLogout}
      >
        Выйти
      </button>
    </div>
  );
}
