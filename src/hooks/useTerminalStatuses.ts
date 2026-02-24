import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

type TerminalStatusMap = Record<number, boolean>;

export function useTerminalStatuses(
  terminals: { id: number }[],
  excludedTerminalId: number | null = null
) {
  const [statuses, setStatuses] = useState<TerminalStatusMap>({});

  useEffect(() => {
    if (!terminals || terminals.length === 0) return;

    const checkStatuses = () => {
      terminals.forEach(t => {
        // пропускаем выбранный терминал
        if (t.id === excludedTerminalId) return;

        const message = `[getorderinfo]|#|terminalid=${t.id}`;
        wsService.send(message);
        console.log('📤 Sending status check:', message);
      });
    };

    const interval = setInterval(checkStatuses, 1000);
    checkStatuses();

    return () => clearInterval(interval);
  }, [terminals, excludedTerminalId]);

  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed = JSON.parse(msg);
        console.log('📊 Parsed wrapper in statuses:', parsed);

        if (parsed.Header?.startsWith("[getorderinfo]")) {
          const body = parsed.Body;
          const terminalId = parsed.Query?.TerminalId;

          if (terminalId == null) return;

          let hasOrder = false;

          if (typeof body === "string") {
            try {
              const parsedBody = JSON.parse(body);
              if (Array.isArray(parsedBody)) {
                hasOrder = parsedBody.length > 0;
              } else if (parsedBody && typeof parsedBody === "object") {
                hasOrder = Object.keys(parsedBody).length > 0;
              }
            } catch {
              hasOrder = body !== "Заказ не найден";
            }
          } else if (Array.isArray(body)) {
            hasOrder = body.length > 0;
          } else if (body && typeof body === "object") {
            hasOrder = true;
          }

          setStatuses(prev => ({ ...prev, [terminalId]: hasOrder }));
        }
      } catch (e) {
        console.error('📊 ❌ Error in statuses handler:', e);
      }
    });

    return unsubscribe;
  }, []);

  return statuses;
}