// Здесь будет ваш серверный JS-код из примера (см. выше)
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint для проверки пользователя
app.post('/api/check-user', async (req, res) => {
    try {
        const { telegramId } = req.body;

        if (!telegramId) {
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramId)
            .single();

        if (error) throw error;

        if (user) {
            res.json({ exists: true, user });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint для создания пользователя
app.post('/api/create-user', async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.telegram_id) {
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint для обновления последнего входа
app.post('/api/update-last-login', async (req, res) => {
    try {
        const { telegramId } = req.body;

        if (!telegramId) {
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        const { error } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('telegram_id', telegramId);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating last login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Все остальные запросы отправляем на index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});