-- Таблица пользователей
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Статистика пользователя
  parties_created INT DEFAULT 0,
  parties_attended INT DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0.00
);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);

-- Таблица вечеринок
CREATE TABLE parties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  max_participants INT NOT NULL CHECK (max_participants BETWEEN 1 AND 999),
  location TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  date TIMESTAMPTZ NOT NULL,
  current_participants INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  invite_token TEXT UNIQUE
);
CREATE INDEX idx_parties_organizer ON parties(organizer_id);
CREATE INDEX idx_parties_date ON parties(date);

-- Таблица участников вечеринок
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (party_id, user_id)
);
CREATE INDEX idx_participants_party ON participants(party_id);
CREATE INDEX idx_participants_user ON participants(user_id);

-- Таблица отзывов и рейтингов
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (party_id, user_id)
);
CREATE INDEX idx_reviews_party ON reviews(party_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Таблица категорий вечеринок
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT
);

-- Связь вечеринок с категориями (многие-ко-многим)
CREATE TABLE party_categories (
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (party_id, category_id)
);

-- Таблица уведомлений
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'confirmation', 'waitlist', 'rating')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Таблица достижений
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  condition TEXT NOT NULL
);

-- Связь пользователей с достижениями
CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Триггер для обновления статистики пользователя при создании вечеринки
CREATE OR REPLACE FUNCTION update_user_party_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET parties_created = parties_created + 1 
  WHERE id = NEW.organizer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_party_created
AFTER INSERT ON parties
FOR EACH ROW
EXECUTE FUNCTION update_user_party_stats();

-- Триггер для обновления счетчика участников
CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE parties
    SET current_participants = current_participants + 1
    WHERE id = NEW.party_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE parties
    SET current_participants = current_participants - 1
    WHERE id = OLD.party_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_participant_change
AFTER INSERT OR DELETE ON participants
FOR EACH ROW
EXECUTE FUNCTION update_participant_count();

-- Функция для генерации токена приглашения
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invite_token := gen_random_uuid()::TEXT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_party_insert
BEFORE INSERT ON parties
FOR EACH ROW
WHEN (NEW.is_public = FALSE)
EXECUTE FUNCTION generate_invite_token();

-- Триггер для обновления среднего рейтинга пользователя
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM reviews
  WHERE user_id = (
    SELECT organizer_id FROM parties WHERE id = NEW.party_id
  );
  
  UPDATE users
  SET average_rating = COALESCE(avg_rating, 0.00)
  WHERE id = (SELECT organizer_id FROM parties WHERE id = NEW.party_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_added
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_user_rating();

-- Заполнение начальных категорий
INSERT INTO categories (name, icon) VALUES
  ('Музыка', 'music'),
  ('Искусство', 'palette'),
  ('Еда', 'utensils'),
  ('Спорт', 'running'),
  ('Образование', 'graduation-cap'),
  ('Танцы', 'music'),
  ('Игры', 'gamepad'),
  ('Кино', 'film'),
  ('Природа', 'tree'),
  ('Технологии', 'laptop');