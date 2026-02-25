// src/components/OrderTable.tsx
import { OrderItem } from "../types/OrderItem";

type OrderTableProps = {
  items: OrderItem[];
};

function OrderTable({ items }: OrderTableProps) {
  // суммарные палеты 
  const totalPlan = items.reduce((sum, item) => sum + (item.raw?.Div || 0), 0);
  const totalFact = items.reduce((sum, item) => sum + (item.raw?.DivReal || 0), 0);

  // сортировка по видимому статусу 
  const orderMap: Record<string, number> = { none: 0, more: 1, less: 2, equal: 3 };

  const sortedItems = [...items].sort((a, b) => {
    const as = (a.displayStatus ?? a.status) as keyof typeof orderMap;
    const bs = (b.displayStatus ?? b.status) as keyof typeof orderMap;
    return orderMap[as] - orderMap[bs];
  });

  // отображаемые номера 
  const displayedItems = sortedItems.map((item, index) => ({
    ...item,
    id: index + 1,
  }));

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
            key={item.raw?.Type1CId ?? item.id}
            className={`status-${(item.displayStatus ?? item.status)} ${item.isUpdating ? "updating" : ""}`}
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