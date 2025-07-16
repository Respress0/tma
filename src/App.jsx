import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabBar from "./components/TabBar";
import EventList from "./components/EventList";
import CreateEvent from "./components/CreateEvent";
import Account from "./components/Account";

function App() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Router>
  );
}

export default App;
