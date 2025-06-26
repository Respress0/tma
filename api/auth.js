import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: 'Telegram ID is required' });
    }

    // Проверяем существование пользователя
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error) throw error;

    if (user) {
      // Обновляем last_login если пользователь существует
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('telegram_id', telegramId);

      if (updateError) throw updateError;
      
      return res.json({ exists: true, user });
    } else {
      // Создаем нового пользователя
      const tgUser = req.body.userData;
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

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (insertError) throw insertError;

      return res.json({ exists: false, user: newUser });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}