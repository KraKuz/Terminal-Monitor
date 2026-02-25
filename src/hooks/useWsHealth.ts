import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

export function useWsHealth() {
  const [isAlive, setIsAlive] = useState(false);

  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed = JSON.parse(msg);
        if (parsed.Header === "[health]" && parsed.Body === "OK") {
          setIsAlive(true);
        } else {
        }
      } catch (e) {}
    });

    wsService.send("[health]");

    const interval = setInterval(() => {
      wsService.send("[health]");
    }, 5000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return isAlive;
}