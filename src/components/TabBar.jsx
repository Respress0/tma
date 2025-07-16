import { Link } from 'react-router-dom';

const TabBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-bar">
      <Link
        to="/events"
        className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
        onClick={() => setActiveTab('events')}
      >
        Мероприятия
      </Link>
      <Link
        to="/create"
        className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
        onClick={() => setActiveTab('create')}
      >
        Создать
      </Link>
      <Link
        to="/account"
        className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
        onClick={() => setActiveTab('account')}
      >
        Аккаунт
      </Link>
    </div>
  );
};

export default TabBar;
