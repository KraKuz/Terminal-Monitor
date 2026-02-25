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
import { useWsConnection } from "./hooks/useWsConnection";

function App() {

  useWsConnection();

  const currentTime = useCurrentTime();
  const isWsAlive = useWsHealth();

  const [selectedTerminalId, setSelectedTerminalId] = React.useState<number | null>(null);
  const terminals = useTerminals();
  const selectedTerminal = terminals.find(t => t.id === selectedTerminalId) ?? null;
  const terminalStatuses = useTerminalStatuses(terminals, selectedTerminal?.id ?? null);

  const orderInfo = useOrderInfo(selectedTerminal?.id);

  const trafficLight = useTrafficLight(selectedTerminal?.id ?? null);

  const orderItems = useOrderDetails(orderInfo, selectedTerminal?.id ?? null);
  
  const handleSelectTerminal = (terminal: Terminal) => {
    setSelectedTerminalId(terminal.id);
  };

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