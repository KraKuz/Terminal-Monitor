import { appConfig } from "../config/appConfig";

type Listener = (msg: string) => void;

class WSService {
  private socket: WebSocket | null = null;
  private listeners: Listener[] = [];

  connect(onMessage: Listener) {
    if (!this.socket) {
      this.socket = new WebSocket(appConfig.url);

      this.socket.onmessage = (event) => {
        this.listeners.forEach(listener => listener(event.data));
      };

      this.socket.onerror = (err) => {
        console.error("WS error:", err);
      };
    }
    this.listeners.push(onMessage);
  }

  send(message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(message);
  }

  close() {
    this.socket?.close();
    this.socket = null;
    this.listeners = [];
  }
}

export const wsService = new WSService();