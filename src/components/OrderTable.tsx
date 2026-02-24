import { OrderItem } from "../types/OrderItem";

type OrderTableProps = {
  items: OrderItem[];
};

function OrderTable({ items }: OrderTableProps) {
// суммарные палеты
  const totalPlan = items.reduce((sum, item) => sum + (item.raw?.Div || 0), 0);
  const totalFact = items.reduce((sum, item) => sum + (item.raw?.DivReal || 0), 0);

  // сортировка по статусу
  const sortedItems = [...items].sort((a, b) => {
    const order = { none: 0, more: 1, less: 2, equal: 3 };
    return order[a.status!] - order[b.status!];
  });

  const displayedItems = sortedItems.map((item, index) => ({
  ...item,
  id: index + 1, // айди всегда 1..N
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
            key={item.id}
            className={`status-${item.status} ${
              item.isUpdating ? "updating" : ""
            }`}
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