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

        const item = updated[idx];

        updated[idx] = {
          ...item,
          isUpdating: true,
          displayStatus: item.displayStatus ?? item.status
        };

        return updated;
      });

      setTimeout(() => {
        setOrderItems(prev => {
          const updated = [...prev];
          const item = updated[1];

          updated[1] = {
            ...item,
            isUpdating: false,
            displayStatus: item.status
          };

          return updated;
        });
      }, 2000);
    };

    const interval = setInterval(toggleRow, 4000);
    return () => clearInterval(interval);
  }, [setOrderItems]);
}