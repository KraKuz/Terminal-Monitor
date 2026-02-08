import { useEffect } from "react";
import { OrderItem } from "../types/OrderItem";

type Params = {
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
};

export function useOrderUpdates({ setOrderItems }: Params) {
  useEffect(() => {
    const toggleRow = () => {
      setOrderItems(prev => {
        const updated = [...prev];
        const idx = 1;

        updated[idx] = {
          ...updated[idx],
          status: updated[idx].status === "done" ? "loading" : "done",
          isUpdating: true,
        };

        return updated;
      });

      setTimeout(() => {
        setOrderItems(prev => {
          const updated = [...prev];
          updated[1] = { ...updated[1], isUpdating: false };
          return updated;
        });
      }, 2000);
    };

    const interval = setInterval(toggleRow, 4000);
    return () => clearInterval(interval);
  }, [setOrderItems]);
}