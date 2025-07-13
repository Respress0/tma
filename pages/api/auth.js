import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { telegramId, userData } = req.body;

      if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID is required' });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const userDataObj = {
        telegram_id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name || '',
        username: userData.username || '',
        language_code: userData.language_code || 'ru',
        is_bot: userData.is_bot || false,
        last_login: new Date().toISOString(),
        photo_url: userData.photo_url || null
      };

      if (!user) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([userDataObj])
          .select()
          .single();

        if (insertError) throw insertError;
        return res.status(200).json({ user: newUser });
      } else {
        const { error: updateError } = await supabase
          .from('users')
          .update({ last_login: userDataObj.last_login })
          .eq('telegram_id', telegramId);

        if (updateError) throw updateError;
        return res.status(200).json({ user });
      }
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
