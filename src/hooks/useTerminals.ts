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
        //console.log('📋 Parsed wrapper:', parsed);
        
        if (parsed.Header === "[getterminals]") {
          // Парсим Body, потому что это строка
          const bodyData = JSON.parse(parsed.Body);
          //console.log('📋 Parsed body:', bodyData);
          
          if (Array.isArray(bodyData)) {
            const mapped = bodyData.map((t: any) => ({
              id: t.Id,
              name: t.Name
            }));
            setTerminals(mapped);
          }
        }
      } catch (e) {
        //console.log('📋 ❌ Error:', e);
      }
    });

    wsService.send("[getterminals]");

    return unsubscribe;
  }, []);

  return terminals;
}