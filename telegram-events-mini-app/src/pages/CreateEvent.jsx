// src/pages/CreateEvent.jsx
import { useState } from "react";

function CreateEvent() {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Мероприятие "${title}" создано!`);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Создать мероприятие</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border rounded p-2 w-full"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
          Создать
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
