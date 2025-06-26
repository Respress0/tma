#!/bin/bash
# filepath: telegram-auth-app/setup.sh

# Создание структуры каталогов
mkdir -p telegram-auth-app/public
mkdir -p telegram-auth-app/server

# Создание README.md
cat > telegram-auth-app/README.md <<EOF
# Telegram Mini App с авторизацией через Supabase

См. инструкцию в проекте.
EOF

# Создание .env с плейсхолдерами
cat > telegram-auth-app/.env <<EOF
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-supabase-anon-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
EOF

# Создание public/index.html
cat > telegram-auth-app/public/index.html <<'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Auth App</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div id="auth-section" class="hidden">
            <h1>Добро пожаловать!</h1>
            <p>Пожалуйста, авторизуйтесь через Telegram</p>
            <button id="auth-button" class="tg-button">Войти через Telegram</button>
        </div>
        <div id="profile-section" class="hidden">
            <h1>Ваш профиль</h1>
            <div class="profile-info">
                <img id="user-avatar" src="" alt="Аватар" class="avatar">
                <h2 id="user-name"></h2>
                <p id="user-username"></p>
            </div>
            <button id="logout-button" class="tg-button logout">Выйти</button>
        </div>
        <div id="loading-section">
            <div class="loader"></div>
            <p>Загрузка...</p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
EOF

# Создание public/style.css
cat > telegram-auth-app/public/style.css <<'EOF'
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
.container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    text-align: center;
}
.hidden { display: none !important; }
.tg-button {
    background-color: #0088cc;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
}
.tg-button:hover { background-color: #0077b3; }
.tg-button.logout { background-color: #ff3b30; }
.tg-button.logout:hover { background-color: #e0352b; }
.profile-info { margin-bottom: 30px; }
.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: block;
    object-fit: cover;
}
.loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #0088cc;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
#loading-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
EOF

# Создание public/script.js
cat > telegram-auth-app/public/script.js <<'EOF'
// Здесь будет ваш JS-код из примера (см. выше)
EOF

# Создание server/index.js
cat > telegram-auth-app/server/index.js <<'EOF'
// Здесь будет ваш серверный JS-код из примера (см. выше)
EOF

# Создание SQL-файла для Supabase
cat > telegram-auth-app/supabase_users.sql <<'EOF'
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT,
  photo_url TEXT,
  language_code TEXT,
  is_bot BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
EOF

# Установка зависимостей
cd telegram-auth-app
npm init -y
npm install express @supabase/supabase-js cors dotenv

echo "Проект создан. Не забудьте заменить ключи в .env и добавить ваш JS-код в public/script.js и server/index.js"