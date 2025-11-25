// backend/services/websocketService.js
const WebSocket = require('ws');

// Store connected clients
const clients = new Set();

// WebSocket server instance (will be set by initWebSocket)
let wss = null;

// Define the broadcast function
const broadcast = (data, eventType = 'BROADCAST') => {
  console.log(`🔊 [WebSocket] Broadcasting ${eventType} event:`, data);
  
  const message = JSON.stringify({
    type: eventType,
    data: data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`📤 [WebSocket] Prepared message for ${eventType}:`, message);
  
  let clientCount = 0;
  clients.forEach((client, index) => {
    if (client.readyState === WebSocket.OPEN) {
      clientCount++;
      try {
        console.log(`📤 [WebSocket] Sending to client ${index}...`);
        client.send(message);
        console.log(`✅ [WebSocket] Sent to client ${index}`);
      } catch (error) {
        console.error('Error sending message to client:', error);
      }
    }
  });
  
  if (process.env.NODE_ENV !== 'test') {
    console.log(`📢 Broadcasted ${eventType} to ${clientCount} clients`);
  }
};

// Initialize WebSocket server
const initWebSocket = (server, path = '/ws') => {
  // Create WebSocket server
  // Disable perMessageDeflate to avoid intermittent connection resets in some environments
  wss = new WebSocket.Server({ 
    server, 
    path,
    clientTracking: true,
    perMessageDeflate: false
  });

  // Attach broadcast to the WebSocket server instance
  wss.broadcast = broadcast;

  // WebSocket connection handling
  wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    const clientId = Date.now(); // Simple client ID for logging
    let isAlive = true;
    let pingInterval = null;
    
    console.log(`🔄 [${clientId}] New WebSocket connection from ${clientIp}`);
    console.log(`🌐 [${clientId}] Total connected clients: ${clients.size + 1}`);
    
    // Add to clients set
    clients.add(ws);
    
    // Log client information
    console.log(`📡 [${clientId}] Client connected. Ready state: ${ws.readyState}`);
    
    // Mark connection as alive on pong
    ws.on('pong', () => {
      isAlive = true;
    });
    
    // Send ping every 30 seconds to keep connection alive
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        if (!isAlive) {
          console.log(`⏱️ [${clientId}] Connection timeout, terminating`);
          ws.terminate();
          return;
        }
        isAlive = false;
        ws.ping();
      }
    }, 30000);

    // Send a welcome message
    ws.send(JSON.stringify({
      type: 'CONNECTION_ESTABLISHED',
      message: 'Connected to WebSocket server',
      timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        // Handle binary ping frames from WebSocket protocol
        if (Buffer.isBuffer(message) && message.length === 0) {
          return;
        }

        const data = JSON.parse(message);
        
        // Handle PING messages (client keepalive)
        if (data.type === 'PING') {
          ws.send(JSON.stringify({
            type: 'PONG',
            data: { timestamp: data.data?.timestamp || Date.now() },
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        // Handle PONG messages (client response to server ping)
        if (data.type === 'PONG') {
          // Just acknowledge, no need to log
          return;
        }
        
        console.log(`📨 Received message from ${clientIp}:`, data);
        
        // Echo other messages back to the client
        ws.send(JSON.stringify({
          type: 'MESSAGE_RECEIVED',
          data: data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
      console.log(`🔌 [${clientId}] WebSocket connection closed. Code: ${code}, Reason: ${reason || 'No reason provided'}`);
      
      // Clear ping interval
      if (pingInterval) {
        clearInterval(pingInterval);
        pingInterval = null;
      }
      
      clients.delete(ws);
      console.log(`🌐 [${clientId}] Remaining connected clients: ${clients.size}`);
      
      // Log the client's ready state
      console.log(`📡 [${clientId}] Final ready state: ${ws.readyState}`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`❌ WebSocket error from ${clientIp}:`, error);
    });
  });

  // Handle WebSocket server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  console.log(`🚀 WebSocket server initialized on path: ${path}`);

  return wss;
};

// Export the WebSocket server and broadcast function
module.exports = {
  initWebSocket,
  broadcast,
  getWSS: () => wss
};
