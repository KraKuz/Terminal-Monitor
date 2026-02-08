import React, { useEffect, useState } from "react";
import './App.css';

type Terminal = {
  id: number;
  name: string;
  hasOrder: boolean;
};

type OrderItem = {
  id: number;
  name: string;
  plan: string;
  fact: string;
  status: "none" | "more" | "done" | "loading"; // цвета
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

// Тестовые данные для таблицы
const testOrderItems: OrderItem[] = [
  { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "none" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "loading" },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(terminals[0]);

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

      {/* Контейнер с информацией о заказе */}
      {selectedTerminal && selectedTerminal.hasOrder && (
        <div className="order-container">
          <div className="order-left">
            <h3>{selectedTerminal.name} Заказ № 000-003312 от 30.12.2025</h3>
            <p>Заказчик: Стиль</p>
            <p>Начало погрузки: 04.02.2026 17:18:16</p>
          </div>
          <div className="order-right">
            <p>Светофор:</p>
            <div className="traffic-light" />
          </div>
        </div>
      )}

      {/* Таблица заказа */}
      {selectedTerminal && selectedTerminal.hasOrder && (
        <table className="order-table">
          <thead>
            <tr>
              <th>№ п/п</th>
              <th>Наименование</th>
              <th>План (n)</th>
              <th>Факт (n)</th>
            </tr>
          </thead>
          <tbody>
            {testOrderItems.map(item => (
              <tr key={item.id} className={`status-${item.status}`}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.plan}</td>
                <td>{item.fact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
    </div>
  );
}

export default App;