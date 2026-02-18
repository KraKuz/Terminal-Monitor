import { Terminal } from "../types/Terminal";
import { OrderInfoData } from "../hooks/useOrderInfo";
import { TrafficLightStatus } from "../types/TrafficLight";
import { trafficLightToClass } from "../utils/trafficLightToClass";

type OrderInfoProps = {
  terminal: Terminal;
  orderInfo: OrderInfoData;
  trafficLight: TrafficLightStatus | null;
};

function OrderInfo({ terminal, orderInfo, trafficLight }: OrderInfoProps) {
  const trafficClass = trafficLightToClass(trafficLight);
  
  return (
    <div className={`order-container ${trafficClass}`}>
      <div className="order-left">
        <h3>
          {terminal.name} Заказ № {orderInfo.name}
        </h3>
        <p>Заказчик: {orderInfo.contractor}</p>
        <p>Начало погрузки:{" "}
          {new Date(orderInfo.shipmentStart).toLocaleString("ru-RU")}</p>
      </div>
    </div>
  );
}

export default OrderInfo;