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

    wsService.send(`[getorderinfo]|#|terminalid=${terminalId}`);

  }, [terminalId]);

  useEffect(() => {
    wsService.connect((msg) => {
      try {
        const parsed = JSON.parse(msg);

        if (
          parsed.Id !== undefined &&
          parsed.Name &&
          parsed.OrderDate &&
          parsed.Contractor
        ) {
          setOrderInfo({
            id: parsed.Id,
            name: parsed.Name,
            orderDate: parsed.OrderDate,
            contractor: parsed.Contractor,
            shipmentStart: parsed.ShipmentStart
          });
        }

      } catch {}
    });
  }, []);

  return orderInfo;
}