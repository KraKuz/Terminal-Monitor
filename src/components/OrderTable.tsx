import React from "react";
import { OrderItem } from "../types/OrderItem";

type OrderTableProps = {
  items: OrderItem[];
};

type WithMeta = OrderItem & { originalIndex: number; zebraClass?: "zebra-odd" | "zebra-even" };

function OrderTable({ items }: OrderTableProps) {
  // суммарные палеты
  const totalPlan = items.reduce((sum, item) => sum + (item.raw?.Div || 0), 0);
  const totalFact = items.reduce((sum, item) => sum + (item.raw?.DivReal || 0), 0);

  const withMeta: WithMeta[] = items.map((it, idx) => ({ ...it, originalIndex: idx }));

  // порядок статусов
  const orderRank: Record<string, number> = { none: 0, more: 1, less: 2, equal: 3 };

const getSortStatus = (item: WithMeta) =>
  item.isUpdating
    ? item.displayStatus ?? item.status
    : item.status;

const sorted = [...withMeta].sort((a, b) => {
  const ra = orderRank[getSortStatus(a) ?? "none"] ?? 0;
  const rb = orderRank[getSortStatus(b) ?? "none"] ?? 0;

  if (ra !== rb) return ra - rb;
  return a.originalIndex - b.originalIndex;
});

  let lessCounter = 0;
  const displayedItems = sorted.map((item, sortedIndex) => {
    const out: WithMeta = { ...item };
    out.id = sortedIndex + 1;
    if (item.status === "less") {
      lessCounter += 1;
      out.zebraClass = lessCounter % 2 === 0 ? "zebra-even" : "zebra-odd";
    } else {
      out.zebraClass = undefined;
    }
    return out;
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
            key={`${item.raw?.Type1CId ?? item.id}-${item.originalIndex}`}
            className={[
              `status-${(item.isUpdating ? item.displayStatus : item.status) ?? "none"}`,
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