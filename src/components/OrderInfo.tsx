// src/components/OrderInfo.tsx
import { Terminal } from "../types/Terminal";
import { OrderInfoData } from "../hooks/useOrderInfo";
import { TrafficLightStatus } from "../types/TrafficLight";

type OrderInfoProps = {
  terminal: Terminal;
  orderInfo: OrderInfoData;
  trafficLight?: TrafficLightStatus | null;
};

function OrderInfo({ terminal, orderInfo, trafficLight }: OrderInfoProps) {
  // три состояния: green, red, default(gray)
  const trafficClass =
    trafficLight === "Allowed" || trafficLight === "PartiallyAllowed"
      ? "traffic-green"
      : trafficLight === "Prohibited" || trafficLight === "PartiallyProhibited"
      ? "traffic-red"
      : "traffic-default";

  return (
    <div className={`order-container ${trafficClass}`}>
      <div className="order-left">
        <h3>
          {terminal.name} Заказ № {orderInfo.name}
        </h3>
        <p>Заказчик: {orderInfo.contractor}</p>
        <p>
          Начало погрузки:{" "}
          {new Date(orderInfo.shipmentStart).toLocaleString("ru-RU")}
        </p>
      </div>

      <div className="order-right">
        {/* Доп. индикация — текстом (опционально) */}
        <p style={{ fontSize: 14, margin: 0 }}>
          Светофор: {trafficLight ?? "Unknown"}
        </p>
      </div>
    </div>
  );
}

export default OrderInfo;