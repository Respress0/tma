// Здесь будет ваш JS-код из примера (см. выше)
// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Элементы DOM
const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const loadingSection = document.getElementById('loading-section');
const authButton = document.getElementById('auth-button');
const logoutButton = document.getElementById('logout-button');
const userName = document.getElementById('user-name');
const userUsername = document.getElementById('user-username');
const userAvatar = document.getElementById('user-avatar');

// Supabase клиент
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Инициализация приложения
async function initApp() {
    try {
        // Проверяем, есть ли сессия в Telegram WebApp
        if (tg.initDataUnsafe?.user) {
            const tgUser = tg.initDataUnsafe.user;
            await handleTelegramAuth(tgUser);
            showProfileSection();
        } else {
            showAuthSection();
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showAuthSection();
    } finally {
        loadingSection.classList.add('hidden');
    }
}

// Обработка авторизации через Telegram// ... (остальной код остается таким же)

// Измененные функции для работы с Vercel API
async function handleTelegramAuth(tgUser) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegramId: tgUser.id,
                userData: tgUser
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Auth failed');
        }

        // Обновляем UI с данными пользователя
        userName.textContent = `${data.user.first_name} ${data.user.last_name}`;
        userUsername.textContent = data.user.username ? `@${data.user.username}` : '';

        if (data.user.photo_url) {
            userAvatar.src = data.user.photo_url;
        } else {
            userAvatar.src = 'https://via.placeholder.com/100';
        }
    } catch (error) {
        console.error('Auth error:', error);
        showAuthSection();
    }
}

// Показываем секцию авторизации
function showAuthSection() {
    authSection.classList.remove('hidden');
    profileSection.classList.add('hidden');
}

// Показываем секцию профиля
function showProfileSection() {
    authSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
}

// Обработчики событий
authButton.addEventListener('click', () => {
    tg.expand();
    tg.openTelegramLink(`https://t.me/${tg.initDataUnsafe.bot.username}?start=webapp`);
});

logoutButton.addEventListener('click', () => {
    showAuthSection();
});

// Инициализируем приложение
tg.ready();
initApp();