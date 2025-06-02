// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import { useEffect } from "react";
import { initTelegram } from "./telegram";

function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
