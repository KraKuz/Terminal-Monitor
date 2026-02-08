import React, { useEffect, useState } from "react";
import './App.css';

type Terminal = {
  id: number;
  name: string;
  hasOrder: boolean;
};

const terminals: Terminal[] = [
  { id: 1, name: "Терминал №1", hasOrder: true },
  { id: 2, name: "Терминал №2", hasOrder: false },
  { id: 3, name: "Терминал №3", hasOrder: true },
  { id: 4, name: "Терминал №4", hasOrder: true },
  { id: 5, name: "Терминал ЖД", hasOrder: false },
  { id: 6, name: "Терминал Малый", hasOrder: false },
  { id: 7, name: "Терминал УПКСКИ", hasOrder: true },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Верхний хедер */}
      <header className="header">
        <div className="header-title">
          Монитор погрузочных терминалов
        </div>
        <div className="header-time">
          {currentTime.toLocaleDateString("ru-RU")}{" "}
          {currentTime.toLocaleTimeString("ru-RU")}
        </div>
      </header>

      {/* Панель терминалов */}
      <div className="terminals-container">
        {terminals.map((terminal) => (
          <button key={terminal.id} className="terminal-button">
            <span className={`status-dot ${terminal.hasOrder ? "green" : "red"}`} />
            {terminal.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;