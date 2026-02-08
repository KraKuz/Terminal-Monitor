import React, { useEffect, useState } from "react";
import './App.css';
import { Terminal } from "./types/Terminal";
import { OrderItem } from "./types/OrderItem";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TerminalSelector from "./components/TerminalSelector";


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
  { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
    { id: 1, name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр', plan: '12 (1+0)', fact: '0 (0+0)', status: "loading" },
  { id: 2, name: 'Умывальник "Комфорт" Белый', plan: '192 (6+0)', fact: '192 (6+0)', status: "done" },
  { id: 3, name: 'Пьедестал Белый', plan: '35 (1+0)', fact: '35 (1+0)', status: "more" },
  { id: 4, name: 'Унитаз-компакт "Детский" (Прайм) Белый', plan: '12 (1+0)', fact: '12 (1+0)', status: "none" },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(testOrderItems);
  const handleSelectTerminal = (terminal: Terminal) => { setSelectedTerminal(terminal); };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Демо обновления строки таблицы
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderItems(prev => {
        const newItems = [...prev];
        const idx = 1; // обновляем вторую строку для примера
        newItems[idx] = {
          ...newItems[idx],
          status: newItems[idx].status === "done" ? "loading" : "done",
          isUpdating: true,
        };
        setTimeout(() => {
          setOrderItems(current => {
            const updated = [...current];
            updated[idx] = { ...updated[idx], isUpdating: false };
            return updated;
          });
        }, 2000); // сброс анимации через 2 секунды
        return newItems;
      });
    }, 4000); // каждые 4 секунды
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      
      {/* Верхний хедер */}
      <Header currentTime={currentTime} />

      {/* Панель терминалов */}
      <TerminalSelector
        terminals={terminals}
        selectedTerminal={selectedTerminal}
        onSelect={handleSelectTerminal}
      />

      {/* Основной контент */}
      <div className="app-content">

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
            {orderItems.map(item => (
              <tr key={item.id} className={`status-${item.status} ${item.isUpdating ? "updating" : ""}`}>
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

      {/* Подвал */}
      <Footer visible={!!selectedTerminal && selectedTerminal.hasOrder} />

    </div>
  );
}

export default App;