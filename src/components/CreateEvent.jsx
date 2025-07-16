import { useState } from "react";
import { createEvent } from "../utils/api";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEvent(formData);
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Создать мероприятие</h2>
      {success && (
        <p style={{ color: "green" }}>Мероприятие успешно создано!</p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Название:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", minHeight: "100px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Дата:
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Место:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 20px",
            background: "#0088cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {isSubmitting ? "Создание..." : "Создать"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
