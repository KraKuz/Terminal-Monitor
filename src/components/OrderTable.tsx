import { OrderItem } from "../types/OrderItem";

type OrderTableProps = {
  items: OrderItem[];
};

function OrderTable({ items }: OrderTableProps) {
  // сортировка по статусу
  const sortedItems = [...items].sort((a, b) => {
    const order = { none: 0, more: 1, loading: 2, done: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th className="col-id">№ п/п</th>
          <th>Наименование</th>
          <th className="col-plan">План (n)</th>
          <th className="col-fact">Факт (n)</th>
        </tr>
      </thead>

      <tbody>
        {sortedItems.map(item => (
          <tr
            key={item.id}
            className={`status-${item.status} ${
              item.isUpdating ? "updating" : ""
            }`}
          >
            <td >{item.id}</td>
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