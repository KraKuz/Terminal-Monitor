import { Terminal } from "../types/Terminal";
import { OrderInfoData } from "../hooks/useOrderInfo";

type OrderInfoProps = {
  terminal: Terminal;
  orderInfo: OrderInfoData;
};

function OrderInfo({ terminal, orderInfo }: OrderInfoProps) {
  return (
    <div className="order-container">
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