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

import { useCurrentTime } from "./hooks/useCurrentTime";
import { useOrderUpdates } from "./hooks/useOrderUpdates";
import { useWsHealth } from "./hooks/useWsHealth";

function App() {

  // текущее время
  const currentTime = useCurrentTime();

  // есть ли соединение
  const isWsAlive = useWsHealth();

  // выбранный терминал
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

  // позиции заказа
  const [orderItems, setOrderItems] = useState<OrderItem[]>(orderItemsMock);

  // обновление строк таблицы
  useOrderUpdates({ setOrderItems });
  
  const handleSelectTerminal = (terminal: Terminal) => { setSelectedTerminal(terminal); };

  return (
    <div className="app-container">
      
      {/* Верхний хедер */}
      <Header currentTime={currentTime} isConnected={isWsAlive} />

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