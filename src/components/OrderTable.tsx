import React from "react";
import { OrderItem } from "../types/OrderItem";

type OrderTableProps = {
  items: OrderItem[];
};

type DisplayItem = OrderItem & {
  zebraClass?: "zebra-odd" | "zebra-even";
};

function OrderTable({ items }: OrderTableProps) {
  // суммарные палеты (берём raw, если есть)
  const totalPlan = items.reduce((sum, item) => sum + (item.raw?.Div || 0), 0);
  const totalFact = items.reduce((sum, item) => sum + (item.raw?.DivReal || 0), 0);

  // сортировка по статусу (порядок: none, more, less, equal)
  const orderRank: Record<string, number> = { none: 0, more: 1, less: 2, equal: 3 };
  const sortedItems = [...items].sort((a, b) => {
    return (orderRank[a.status ?? "none"] ?? 0) - (orderRank[b.status ?? "none"] ?? 0);
  });

  // Присвоим класс зебры только строкам со статусом "less".
  // Счётчик считает только такие строки, чтобы зебра шла среди белых полей.
  let lessCounter = 0;
  const displayedItems: DisplayItem[] = sortedItems.map((item, index) => {
    const base: DisplayItem = { ...item };
    // id показываем всегда по порядку 1..N (внешний индекс)
    base.id = index + 1;

    if (item.status === "less") {
      lessCounter += 1;
      base.zebraClass = lessCounter % 2 === 0 ? "zebra-even" : "zebra-odd";
    }

    return base;
  });

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th className="col-id">№ п/п</th>
          <th>Наименование</th>
          <th className="col-plan">План ({totalPlan})</th>
          <th className="col-fact">Факт ({totalFact})</th>
        </tr>
      </thead>

      <tbody>
        {displayedItems.map(item => (
          <tr
            key={`${item.raw?.Type1CId ?? item.id}-${item.id}`}
            className={[
              `status-${item.status ?? "none"}`,
              item.isUpdating ? "updating" : "",
              item.zebraClass ? item.zebraClass : ""
            ].join(" ").trim()}
          >
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.plan}</td>
            <td>{item.fact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderTable;