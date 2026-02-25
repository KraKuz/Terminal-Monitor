// src/hooks/useTrafficLight.ts
import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";
import { TrafficLightStatus } from "../types/TrafficLight";

type WrappedTrafficLight = { Key?: number; Value?: TrafficLightStatus };

export function useTrafficLight(terminalId: number | null) {
  const [status, setStatus] = useState<TrafficLightStatus | null>(null);

  useEffect(() => {
    if (terminalId == null) {
      setStatus(null);
      return;
    }

    const fetchStatus = () => {
      wsService.send(`[gettrafficlightstatus]|#|terminalid=${terminalId}`);
    };

    // первый вызов сразу, потом интервал
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, [terminalId]);

  useEffect(() => {
    // подписка на сообщения
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed = JSON.parse(msg);

        // фильтруем по заголовку
        if (!parsed.Header || !parsed.Header.toString().startsWith("[gettrafficlightstatus]")) return;

        // фильтруем по terminalId в Query
        if (parsed.Query?.TerminalId !== terminalId) return;

        // Body может быть строкой JSON или объектом
        const rawBody = parsed.Body;
        let body: WrappedTrafficLight | null = null;
        if (typeof rawBody === "string") {
          try {
            body = JSON.parse(rawBody);
          } catch {
            body = null;
          }
        } else if (typeof rawBody === "object" && rawBody !== null) {
          body = rawBody;
        }

        if (!body) return;

        // Если есть Value — используем его; если нет, но есть Key — маппим на значение
        if (body.Value) {
          setStatus(body.Value);
        } else if (typeof body.Key === "number") {
          const keyMap: TrafficLightStatus[] = [
            "Off",
            "Allowed",
            "Prohibited",
            "AdditionalAction",
            "PartiallyAllowed",
            "PartiallyProhibited",
            "RepeatAction",
            "Loading"
          ];
          const v = keyMap[body.Key] ?? "Off";
          setStatus(v);
        }
      } catch (e) {
        // Игнорируем неверные/непарсируемые сообщения
      }
    });

    return unsubscribe;
  }, [terminalId]);

  return status;
}