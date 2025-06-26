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

// Обработка авторизации через Telegram
async function handleTelegramAuth(tgUser) {
    try {
        // Проверяем, есть ли пользователь в базе
        const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', tgUser.id)
            .single();

        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }

        // Если пользователя нет, создаем нового
        if (!existingUser) {
            const userData = {
                telegram_id: tgUser.id,
                first_name: tgUser.first_name,
                last_name: tgUser.last_name || '',
                username: tgUser.username || '',
                language_code: tgUser.language_code || 'ru',
                is_bot: tgUser.is_bot || false,
                last_login: new Date().toISOString()
            };

            if (tgUser.photo_url) {
                userData.photo_url = tgUser.photo_url;
            }

            const { error: insertError } = await supabase
                .from('users')
                .insert([userData]);

            if (insertError) throw insertError;
        } else {
            // Обновляем последний логин
            const { error: updateError } = await supabase
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('telegram_id', tgUser.id);

            if (updateError) throw updateError;
        }

        // Загружаем данные пользователя
        await loadUserProfile(tgUser.id);
    } catch (error) {
        console.error('Auth error:', error);
        throw error;
    }
}

// Загрузка профиля пользователя
async function loadUserProfile(telegramId) {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramId)
            .single();

        if (error) throw error;

        // Обновляем UI
        userName.textContent = `${user.first_name} ${user.last_name}`;
        userUsername.textContent = user.username ? `@${user.username}` : '';

        if (user.photo_url) {
            userAvatar.src = user.photo_url;
        } else {
            userAvatar.src = 'https://via.placeholder.com/100';
        }
    } catch (error) {
        console.error('Profile load error:', error);
        throw error;
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