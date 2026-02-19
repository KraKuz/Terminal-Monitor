import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";
import { TrafficLightStatus } from "../types/TrafficLight";

type TrafficLightResponse = {
  Key: number;
  Value: TrafficLightStatus;
};

export function useTrafficLight(terminalId: number | null) {
  const [status, setStatus] = useState<TrafficLightStatus | null>(null);

  useEffect(() => {
    if (!terminalId) return;

    const fetchStatus = () => {
      wsService.send(`[gettrafficlightstatus]|#|terminalid=${terminalId}`);
    };

    const interval = setInterval(fetchStatus, 1000);
    fetchStatus();

    return () => clearInterval(interval);
  }, [terminalId]);

  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed: TrafficLightResponse = JSON.parse(msg);

        if (parsed?.Value) {
          setStatus(parsed.Value);
        }
      } catch {}
    });

    return unsubscribe;
  }, []);

  return status;
}
