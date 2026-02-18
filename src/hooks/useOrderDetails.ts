import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

export type OrderDetailsRaw = {
  Type1CId: number;
  FullName: string;
  AmountCurrent: number;
  AmountTotal: number;
  AmountStandart: number;
  Div: number;
  Rem: number;
  DivReal: number;
  RemReal: number;
  State: "none" | "more" | "done" | "loading";
  IsUpdated: boolean;
};

export type OrderItem = {
  id: number;        // индекс + 1
  name: string;      // FullName
  plan: string;      // Div + Rem
  fact: string;      // DivReal + RemReal
  status: "none" | "more" | "done" | "loading";
  isUpdating: boolean;
  raw: OrderDetailsRaw;
};

export function useOrderDetails(terminalId: number | null) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (terminalId === null || terminalId === undefined) return;

    const fetchOrder = () => {
      wsService.send(`[getorderdetails]|#|terminalid=${terminalId}|#|orderid=0|#|startdate=0`);
      // orderid и startdate заменить на реальные
    };

    const interval = setInterval(fetchOrder, 1000);
    fetchOrder(); // первый вызов сразу

    return () => clearInterval(interval);
  }, [terminalId]);

  useEffect(() => {
    const handleMessage = (msg: string) => {
      try {
        const parsed: OrderDetailsRaw[] = JSON.parse(msg);

        if (Array.isArray(parsed) && parsed.length) {
          const mapped = parsed.map((item, index) => ({
            id: index + 1,
            name: item.FullName,
            plan: `${item.Div}+${item.Rem}`,
            fact: `${item.DivReal}+${item.RemReal}`,
            status: item.State,
            isUpdating: item.IsUpdated,
            raw: item,
          }));

          setOrderItems(mapped);
        }
      } catch {}
    };

    wsService.connect(handleMessage);
  }, []);

  return orderItems;
}