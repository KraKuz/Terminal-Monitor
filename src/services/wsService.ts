import { appConfig } from "../config/appConfig";

type Listener = (msg: string) => void;

class WSService {
  private socket: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private messageQueue: string[] = []; // очередь сообщений, отправленных до открытия сокета

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(appConfig.url);

    this.socket.onopen = () => {
      // все накопившиеся сообщения
      while (this.messageQueue.length) {
        const msg = this.messageQueue.shift();
        if (msg) this.socket?.send(msg);
      }
    };

    this.socket.onmessage = (event) => {
      const data = event.data;

      if (typeof data === "string") {
        this.listeners.forEach(listener => listener(data));
      } else if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          this.listeners.forEach(listener => listener(text));
        };
        reader.readAsText(data);
      } else if (data instanceof ArrayBuffer) {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(data);
        this.listeners.forEach(listener => listener(text));
      }
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
  //console.log('🟢 SENDING:', message); // <-- ЛОГ
  if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
    this.messageQueue.push(message);
    return;
  }
  this.socket.send(message);
}
}

export const wsService = new WSService();