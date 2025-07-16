import { useState } from 'react';
import { createEvent } from '../utils/api';

const CreateEvent = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEvent({
        ...formData,
        organizer: user?.firstName || 'Аноним'
      });
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Создать мероприятие</h2>
      {success && <p style={{ color: 'green' }}>Мероприятие успешно создано!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Название:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Дата и время:
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Место проведения:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать мероприятие'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
