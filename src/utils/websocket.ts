import { toast } from '@/components/ui/use-toast';

type MessageHandler = (message: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // 1 second
  private maxReconnectDelay = 30000; // 30 seconds
  private isConnected = false;
  private url: string;
  private manuallyClosed = false; // Track if user manually closed connection

  constructor(url: string) {
    this.url = url;
    // Do NOT auto-connect here for React
  }

  // Public connect method
  public connect() {
  // ✅ FIX: Prevent duplicate connections in React Strict Mode
  if (this.socket && 
     (this.socket.readyState === WebSocket.OPEN ||
      this.socket.readyState === WebSocket.CONNECTING)) {
    console.log("WebSocket is already connected or connecting.");
    return;
  }

  console.log("🌐 Connecting to WebSocket at", this.url);
  this.socket = new WebSocket(this.url);


    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyHandlers({
        type: 'CONNECTION_ESTABLISHED',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString(),
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📨 Received message:', message);
        this.notifyHandlers(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`🔌 WebSocket disconnected: ${event.code} ${event.reason || 'No reason provided'}`);
      this.isConnected = false;

      if (!this.manuallyClosed && event.code !== 1000) {
        this.attemptReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.socket?.close();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      toast({
        title: 'Connection lost',
        description: 'Unable to reconnect to the server. Please refresh the page.',
        variant: 'destructive',
      });
      return;
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    console.log(
      `🔄 Attempting to reconnect in ${delay / 1000}s (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`
    );

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private notifyHandlers(message: any) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in WebSocket message handler:', error);
      }
    });
  }

  addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  subscribe(eventType: string, handler: (data: any) => void): () => void {
    const wrapper: MessageHandler = (message) => {
      try {
        if (!message) return;
        const type = message.type || message.event || null;
        const payload = message.data || message.payload || message;
        if (type === eventType) {
          handler(payload);
        }
      } catch (err) {
        console.error('Error in subscribe wrapper:', err);
      }
    };

    this.messageHandlers.add(wrapper);
    return () => this.messageHandlers.delete(wrapper);
  }

  send(message: any): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket is not connected');
      return false;
    }
  }

  close() {
    this.manuallyClosed = true;
    if (this.socket) {
      this.socket.close(1000, 'User closed connection');
      this.socket = null;
    }
    this.isConnected = false;
  }

  get connectionStatus() {
    return this.isConnected ? 'connected' : 'disconnected';
  }
}

// Single instance for the app
const webSocketService = new WebSocketService('ws://localhost:5000/ws');

export default webSocketService;
