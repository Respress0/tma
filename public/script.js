document.addEventListener('DOMContentLoaded', () => {
    // ✅ Инициализация Supabase
    const supabase = window.supabase.createClient(
        'https://aatlvnreiwitnopwlgci.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdGx2bnJlaXdpdG5vcHdsZ2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDU4NzcsImV4cCI6MjA2NjUyMTg3N30.y7oREoOvyUvdmWUQEdu5tStVuom1DKvtETbZpwHbq44'
    );


    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand(); // Раскрываем приложение на весь экран

    // DOM элементы
    const elements = {
        authSection: document.getElementById('auth-section'),
        profileSection: document.getElementById('profile-section'),
        loadingSection: document.getElementById('loading-section'),
        authButton: document.getElementById('auth-button'),
        logoutButton: document.getElementById('logout-button'),
        userName: document.getElementById('user-name'),
        userUsername: document.getElementById('user-username'),
        userAvatar: document.getElementById('user-avatar')
    };

    // Основные функции
    async function handleTelegramAuth(tgUser) {
        try {
            // Проверяем существование пользователя
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('telegram_id', tgUser.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (!user) {
                // Создаем нового пользователя
                const userData = {
                    telegram_id: tgUser.id,
                    first_name: tgUser.first_name,
                    last_name: tgUser.last_name || '',
                    username: tgUser.username || '',
                    language_code: tgUser.language_code || 'ru',
                    is_bot: tgUser.is_bot || false,
                    last_login: new Date().toISOString(),
                    photo_url: tgUser.photo_url || null
                };

                const { error: insertError } = await supabase
                    .from('users')
                    .insert([userData]);

                if (insertError) throw insertError;
            } else {
                // Обновляем время последнего входа
                await supabase
                    .from('users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('telegram_id', tgUser.id);
            }

            // Обновляем UI
            updateUserProfile(tgUser);
        } catch (error) {
            console.error('Auth error:', error);
            showView('auth');
        }
    }

    function updateUserProfile(tgUser) {
        elements.userName.textContent = `${tgUser.first_name} ${tgUser.last_name || ''}`.trim();
        elements.userUsername.textContent = tgUser.username ? `@${tgUser.username}` : '';
        elements.userAvatar.src = tgUser.photo_url || 'https://via.placeholder.com/100';
        showView('profile');
    }

    function showView(view) {
        elements.authSection.classList.toggle('hidden', view !== 'auth');
        elements.profileSection.classList.toggle('hidden', view !== 'profile');
        elements.loadingSection.classList.add('hidden');
    }

    // Обработчики событий
    elements.authButton.addEventListener('click', () => {
        if (tg.initDataUnsafe?.bot?.username) {
            tg.openTelegramLink(`https://t.me/${tg.initDataUnsafe.bot.username}?start=webapp`);
        } else {
            console.error('Bot username not available');
            alert('Ошибка авторизации. Попробуйте позже.');
        }
    });

    elements.logoutButton.addEventListener('click', () => showView('auth'));

    // Инициализация приложения
    function initApp() {
        try {
            if (tg.initDataUnsafe?.user) {
                handleTelegramAuth(tg.initDataUnsafe.user);
            } else {
                showView('auth');
            }
        } catch (error) {
            console.error('Init error:', error);
            showView('auth');
        }
    }

    // Запускаем приложение когда Telegram WebApp готов
    tg.ready();
    initApp();
});