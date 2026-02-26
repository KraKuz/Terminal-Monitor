// src/hooks/useTrafficLight.ts
import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";
import { TrafficLightStatus } from "../types/TrafficLight";

type WrappedTrafficLight = { Key?: number; Value?: TrafficLightStatus };

export function useTrafficLight(terminalId: number | null) {
  const [status, setStatus] = useState<TrafficLightStatus | null>(null);

  useEffect(() => {
    if (terminalId == null) {
      //console.log("🚦 TrafficLight: terminalId is null");
      setStatus(null);
      return;
    }

    const fetchStatus = () => {
      const cmd = `[gettrafficlightstatus]|#|terminalid=${terminalId}`;
      //console.log("📤 TrafficLight SEND:", cmd);
      wsService.send(cmd);
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

        //console.log("📥 TrafficLight RAW:", parsed);
        
        if (parsed.Query?.TerminalId !== terminalId) {
          //console.log("⛔ TrafficLight skipped by terminal filter", parsed.Query?.TerminalId);
          return;
        } 

        const rawBody = parsed.Body;
        //console.log("📦 TrafficLight Body:", rawBody);

        let body: WrappedTrafficLight | null = null;
        if (typeof rawBody === "string") {
          try {
            body = JSON.parse(rawBody);
          } catch {
            //console.log("⚠️ Body string but not JSON:", rawBody);
            body = null;
          }
        } else if (typeof rawBody === "object" && rawBody !== null) {
          body = rawBody;
        }

        if (!body) {
          //console.log("❌ TrafficLight body empty");
          return;
        }

        //console.log("🔍 Parsed Body:", body);

        if (body.Value) {
          //console.log("✅ Using Value:", body.Value);
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
          console.log("🔄 Using Key mapping:", body.Key, "=>", v);
          setStatus(v);
        }
        else {
          //console.log("⚠️ Body has neither Value nor Key");
        }
      } catch (e) {
        //console.log("❌ TrafficLight parse error", e);
        // игнор неверные/непарсируемые сообщения
      }
    });

    return unsubscribe;
  }, [terminalId]);

  return status;
}