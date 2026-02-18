import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

type TerminalStatusMap = Record<number, boolean>;

export function useTerminalStatuses(terminals: { id: number }[]) {
  const [statuses, setStatuses] = useState<TerminalStatusMap>({});

  useEffect(() => {
    if (!terminals.length) return;

    const checkStatuses = () => {
      terminals.forEach(t => {
        wsService.send(`[getorder:${t.id}]`);
      });
    };

    const interval = setInterval(checkStatuses, 4000);

    checkStatuses(); // первый запуск сразу

    return () => clearInterval(interval);
  }, [terminals]);

  useEffect(() => {
    wsService.connect((msg) => {
      try {
        const parsed = JSON.parse(msg);

        // сервер вернул заказ
        if (parsed.orderItems !== undefined && parsed.terminalId !== undefined) {
          setStatuses(prev => ({
            ...prev,
            [parsed.terminalId]: parsed.orderItems.length > 0
          }));
        }

      } catch {}
    });
  }, []);

  return statuses;
}