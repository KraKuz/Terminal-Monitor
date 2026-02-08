import React, { useEffect, useState } from "react";
import './App.css';

import { Terminal } from "./types/Terminal";
import { OrderItem } from "./types/OrderItem";

import Header from "./components/Header";
import TerminalSelector from "./components/TerminalSelector";
import OrderInfo from "./components/OrderInfo";
import OrderTable from "./components/OrderTable";
import Footer from "./components/Footer";

import { terminalsMock } from "./mock/terminals";
import { orderItemsMock } from "./mock/orderItems";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(orderItemsMock);
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
        terminals={terminalsMock}
        selectedTerminal={selectedTerminal}
        onSelect={handleSelectTerminal}
      />

      {/* Основной контент */}
      <div className="app-content">

        {/* Контейнер с информацией о заказе */}
        {selectedTerminal && selectedTerminal.hasOrder && ( <OrderInfo terminal={selectedTerminal} /> )}

        {/* Таблица заказа */}
        {selectedTerminal && selectedTerminal.hasOrder && ( <OrderTable items={orderItems} /> )}
      
      </div>

      {/* Подвал */}
      <Footer visible={!!selectedTerminal && selectedTerminal.hasOrder} />

    </div>
  );
}

export default App;