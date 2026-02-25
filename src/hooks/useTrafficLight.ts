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

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, [terminalId]);

  useEffect(() => {
    // подписка на сообщения
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed = JSON.parse(msg);

        if (!parsed.Header || !parsed.Header.toString().startsWith("[gettrafficlightstatus]")) return;

        if (parsed.Query?.TerminalId !== terminalId) return;

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
        // игнор неверные/непарсируемые сообщения
      }
    });

    return unsubscribe;
  }, [terminalId]);

  return status;
}