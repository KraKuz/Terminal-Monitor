import React, { useEffect, useState } from "react";
import './App.css';

import { Terminal } from "./types/Terminal";
// import { OrderItem } from "./types/OrderItem";

import Header from "./components/Header";
import TerminalSelector from "./components/TerminalSelector";
import OrderInfo from "./components/OrderInfo";
import OrderTable from "./components/OrderTable";
import Footer from "./components/Footer";

// import { terminalsMock } from "./mock/terminals";
// import { orderItemsMock } from "./mock/orderItems";

import { useCurrentTime } from "./hooks/useCurrentTime";
// import { useOrderUpdates } from "./hooks/useOrderUpdates";
import { useWsHealth } from "./hooks/useWsHealth";
import { useTerminals } from "./hooks/useTerminals";
import { useTerminalStatuses } from "./hooks/useTerminalStatuses";
import { useOrderInfo } from "./hooks/useOrderInfo";
import { useOrderDetails } from "./hooks/useOrderDetails";
import { useTrafficLight } from "./hooks/useTrafficLight";

function App() {

  // текущее время
  const currentTime = useCurrentTime();

  // есть ли соединение
  const isWsAlive = useWsHealth();

  // выбранный терминал
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

  // список терминалов
  const terminals = useTerminals();
  const terminalStatuses = useTerminalStatuses(terminals);

  const orderInfo = useOrderInfo(selectedTerminal?.id);

  const trafficLight = useTrafficLight(selectedTerminal?.id ?? null);

  // позиции заказа
  const orderItems = useOrderDetails(selectedTerminal?.id ?? null);
  
  const handleSelectTerminal = (terminal: Terminal) => { setSelectedTerminal(terminal); };

  return (
    <div className="app-container">
      
      {/* Верхний хедер */}
      <Header currentTime={currentTime} isConnected={isWsAlive} />

      {/* Панель терминалов */}
      <TerminalSelector
        terminals={terminals}
        selectedTerminal={selectedTerminal}
        onSelect={handleSelectTerminal}
        statuses={terminalStatuses}
      />

      {/* Основной контент */}
      <div className="app-content">

        {/* Контейнер с информацией о заказе */}
        {selectedTerminal && terminalStatuses[selectedTerminal.id] && orderInfo && ( <OrderInfo terminal={selectedTerminal} orderInfo={orderInfo} trafficLight={trafficLight}/> )}

        {/* Таблица заказа */}
        {selectedTerminal && terminalStatuses[selectedTerminal.id] && ( <OrderTable items={orderItems} /> )}
      
      </div>

      {/* Подвал */}
      <Footer visible={!!selectedTerminal && terminalStatuses[selectedTerminal.id]} />

    </div>
  );
}

export default App;