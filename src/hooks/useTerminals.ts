import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

export type Terminal = {
  id: number;
  name: string;
};

export function useTerminals() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);

  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed = JSON.parse(msg);

        if (Array.isArray(parsed)) {
          const mapped = parsed.map((t: any) => ({
            id: t.Id,
            name: t.Name
          }));
          setTerminals(mapped);
        }
      } catch {}
    });

    wsService.send("[getterminals]");

    return unsubscribe;
  }, []);

  return terminals;
}