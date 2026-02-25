import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

export type OrderInfoData = {
  id: number;
  name: string;
  orderDate: string;
  contractor: string;
  shipmentStart: string;
};

export function useOrderInfo(terminalId?: number) {
  const [orderInfo, setOrderInfo] = useState<OrderInfoData | null>(null);

  useEffect(() => {
  if (!terminalId) return;

  const fetch = () => {
    wsService.send(`[getorderinfo]|#|terminalid=${terminalId}`);
  };

  fetch(); // сразу
  const interval = setInterval(fetch, 1000);

  return () => clearInterval(interval);
}, [terminalId]);

  useEffect(() => {
  const unsubscribe = wsService.subscribe((msg) => {
    try {
      const parsed = JSON.parse(msg);

      if (!parsed.Header?.startsWith("[getorderinfo]")) return;

      // ❗ ВАЖНО: фильтруем по текущему терминалу
      if (parsed.Query?.TerminalId !== terminalId) return;

      const body = parsed.Body;

      if (typeof body === "string" && body === "Заказ не найден") {
        setOrderInfo(null);
        return;
      }

      const data = typeof body === "string" ? JSON.parse(body) : body;

      if (data?.Id) {
        setOrderInfo({
          id: data.Id,
          name: data.Name,
          orderDate: data.OrderDate,
          contractor: data.Contractor,
          shipmentStart: data.ShipmentStart
        });
      }
    } catch {}
  });

  return unsubscribe;
}, [terminalId]);

  return orderInfo;
}