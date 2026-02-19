import { appConfig } from "../config/appConfig";

type Listener = (msg: string) => void;

class WSService {
  private socket: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(appConfig.url);

    this.socket.onmessage = (event) => {
      this.listeners.forEach(listener => listener(event.data));
    };

    this.socket.onerror = (err) => {
      console.error("WS error:", err);
    };

    this.socket.onclose = () => {
      this.socket = null;
    };
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  send(message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(message);
  }
}

export const wsService = new WSService();