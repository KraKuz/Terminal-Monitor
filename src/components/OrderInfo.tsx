import { Terminal } from "../types/Terminal";

type OrderInfoProps = {
  terminal: Terminal;
};

function OrderInfo({ terminal }: OrderInfoProps) {
  return (
    <div className="order-container">
      <div className="order-left">
        <h3>
          {terminal.name} Заказ № 000-003312 от 30.12.2025
        </h3>
        <p>Заказчик: Стиль</p>
        <p>Начало погрузки: 04.02.2026 17:18:16</p>
      </div>
    </div>
  );
}

export default OrderInfo;