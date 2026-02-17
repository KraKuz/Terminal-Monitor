import { useEffect, useState } from "react";
import { wsService } from "../services/wsService";

export function useWsHealth() {
  const [isAlive, setIsAlive] = useState(false);

  useEffect(() => {
    wsService.connect((msg) => {
      if (msg === "OK") {
        setIsAlive(true);
      }
    });

    const interval = setInterval(() => {
      wsService.send("[health]");
    }, 5000);

    return () => {
      clearInterval(interval);
      wsService.close();
    };
  }, []);

  return isAlive;
}