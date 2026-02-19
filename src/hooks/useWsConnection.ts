import { useEffect } from "react";
import { wsService } from "../services/wsService";

export function useWsConnection() {
  useEffect(() => {
    wsService.connect();
  }, []);
}