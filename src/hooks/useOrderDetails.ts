import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";
import { OrderInfoData } from "./useOrderInfo";

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
  State: "none" | "more" | "equal" | "less";
  IsUpdated: boolean;
};

export type OrderItem = {
  id: number;
  name: string;
  plan: string;
  fact: string;
  status: "none" | "more" | "equal" | "less";
  isUpdating: boolean;
  raw: OrderDetailsRaw;
};

function mapStateToStatus(state: number): "none" | "more" | "equal" | "less" {
  switch(state) {
    case 0: return "none";     // NotInOrder
    case 1: return "more";     // TooMany
    case 2: return "less";     // InWork
    case 3: console.log("EQUAL"); return "equal";    // Complete
    default: return "less";
  }
}

export function useOrderDetails(orderInfo: OrderInfoData | null, terminalId: number | null) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!orderInfo || terminalId == null) {
      setOrderItems([]);
      return;
    }

    const orderId = orderInfo.id;
    const startDate = orderInfo.shipmentStart;
    const fetchOrder = () => {
      const msg = `[getorderdetails]|#|terminalid=${terminalId}|#|orderid=${orderId}|#|startdate=${startDate}`;
      //console.log('📤 Sending getorderdetails:', msg);
      wsService.send(msg);
    };

    const interval = setInterval(fetchOrder, 1000);
    fetchOrder();

    return () => clearInterval(interval);
  }, [orderInfo, terminalId]);

useEffect(() => {
  const unsubscribe = wsService.subscribe((msg) => {
    try {
      const parsed = JSON.parse(msg);

      if (!parsed.Header?.startsWith("[getorderdetails]")) return;

      // ❗ фильтр по терминалу
      if (parsed.Query?.TerminalId !== terminalId) return;

      const body = typeof parsed.Body === "string"
        ? JSON.parse(parsed.Body)
        : parsed.Body;

      if (!Array.isArray(body)) return;

      const mapped = body.map((item, index) => ({
        id: index + 1,
        name: item.FullName,
        plan: `${item.AmountTotal.toString()} (${item.Div}+${item.Rem})`,
        fact: `${item.AmountCurrent.toString()} (${item.DivReal}+${item.RemReal})`,
        status: mapStateToStatus(item.State),
        isUpdating: item.IsUpdated,
        raw: item,
      }));

      setOrderItems(mapped);

    } catch {}
  });

  return unsubscribe;
}, [terminalId]);

  return orderItems;
}