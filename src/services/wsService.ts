import { appConfig } from "../config/appConfig";

class WSService {
  private socket: WebSocket | null = null;

  connect(onMessage: (msg: any) => void) {
    this.socket = new WebSocket(appConfig.url);

    this.socket.onmessage = (event) => {
      onMessage(event.data);
    };

    this.socket.onerror = (err) => {
      console.error("WS error:", err);
    };
  }

  send(message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(message);
  }

  close() {
    this.socket?.close();
  }
}

export const wsService = new WSService();