// Simple WebSocket Collaboration Server
// Run with: node collaboration-server.js

const WebSocket = require('ws');
const http = require('http');

// Use environment variable for port (production) or default to 8080 (development)
const PORT = process.env.PORT || 8080;

// Store active rooms and their data
const rooms = new Map();

// Create HTTP server with CORS support
const server = http.createServer((req, res) => {
  // CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'running',
    message: 'Collaboration WebSocket Server',
    port: PORT,
    timestamp: new Date().toISOString()
  }));
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

console.log(`🚀 Collaboration Server starting on port ${PORT}...`);

wss.on('connection', (ws) => {
  console.log('👤 New client connected');
  
  let currentRoom = null;
  let userId = null;
  let userName = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'join':
          handleJoin(ws, data);
          break;
        case 'code-change':
          handleCodeChange(ws, data);
          break;
        case 'chat-message':
          handleChatMessage(ws, data);
          break;
        case 'heartbeat':
          handleHeartbeat(ws, data);
          break;
        case 'leave':
          handleLeave(ws, data);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('👋 Client disconnected');
    if (currentRoom && userId) {
      handleDisconnect(currentRoom, userId, userName);
    }
  });

  function handleJoin(ws, data) {
    const { roomId, user } = data;
    currentRoom = roomId;
    userId = user.id;
    userName = user.name;

    console.log(`✅ ${userName} joined room ${roomId}`);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        code: `// Welcome to collaborative coding!
// Start typing to see real-time collaboration

function hello() {
  console.log("Hello, team!");
}

// Try adding your code here
const greet = (name) => {
  return \`Hello, \${name}! Welcome to the session.\`;
};

console.log(greet("Developer"));`,
        messages: [
          {
            id: 'msg-1',
            user: 'System',
            message: 'Welcome to the collaboration session!',
            timestamp: new Date().toISOString(),
            type: 'system',
          },
          {
            id: 'msg-2',
            user: 'System',
            message: 'Start coding together! Changes will be synchronized in real-time.',
            timestamp: new Date().toISOString(),
            type: 'system',
          },
        ],
        participants: [],
        clients: new Map(),
      });
    }

    const room = rooms.get(roomId);
    
    // Add participant
    const participant = {
      id: user.id,
      name: user.name,
      color: user.color,
      isOwner: room.participants.length === 0,
      isActive: true,
      lastSeen: Date.now(),
    };
    
    room.participants.push(participant);
    room.clients.set(user.id, ws);

    // Add join message
    const joinMessage = {
      id: `msg-join-${Date.now()}`,
      user: 'System',
      message: `${user.name} joined the session`,
      timestamp: new Date().toISOString(),
      type: 'system',
    };
    room.messages.push(joinMessage);

    // Send current state to the new user
    ws.send(JSON.stringify({
      type: 'init',
      data: {
        code: room.code,
        messages: room.messages,
        participants: room.participants,
      },
    }));

    // Broadcast to all other users in the room
    broadcastToRoom(roomId, {
      type: 'user-joined',
      data: {
        participant,
        message: joinMessage,
        participants: room.participants,
      },
    }, user.id);
  }

  function handleCodeChange(ws, data) {
    const { roomId, code } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.code = code;
      
      // Broadcast to all other users in the room
      broadcastToRoom(roomId, {
        type: 'code-update',
        data: { code },
      }, userId);
    }
  }

  function handleChatMessage(ws, data) {
    const { roomId, message } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.messages.push(message);
      
      // Broadcast to all users in the room (including sender)
      broadcastToRoom(roomId, {
        type: 'chat-update',
        data: { message },
      });
    }
  }

  function handleHeartbeat(ws, data) {
    const { roomId, userId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      const participant = room.participants.find(p => p.id === userId);
      if (participant) {
        participant.lastSeen = Date.now();
        participant.isActive = true;
      }
    }
  }

  function handleLeave(ws, data) {
    const { roomId, userId, userName } = data;
    handleDisconnect(roomId, userId, userName);
  }

  function handleDisconnect(roomId, userId, userName) {
    const room = rooms.get(roomId);
    
    if (room) {
      // Mark user as inactive
      const participant = room.participants.find(p => p.id === userId);
      if (participant) {
        participant.isActive = false;
      }

      // Remove client
      room.clients.delete(userId);

      // Add leave message
      const leaveMessage = {
        id: `msg-leave-${Date.now()}`,
        user: 'System',
        message: `${userName} left the session`,
        timestamp: new Date().toISOString(),
        type: 'system',
      };
      room.messages.push(leaveMessage);

      // Broadcast to remaining users
      broadcastToRoom(roomId, {
        type: 'user-left',
        data: {
          userId,
          message: leaveMessage,
          participants: room.participants,
        },
      });

      // Clean up empty rooms
      if (room.clients.size === 0) {
        console.log(`🧹 Cleaning up empty room ${roomId}`);
        rooms.delete(roomId);
      }
    }
  }

  function broadcastToRoom(roomId, message, excludeUserId = null) {
    const room = rooms.get(roomId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    
    room.clients.forEach((client, clientId) => {
      if (clientId !== excludeUserId && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Collaboration Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});

// Cleanup inactive users every 30 seconds
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, roomId) => {
    room.participants.forEach(participant => {
      if (now - participant.lastSeen > 30000) {
        participant.isActive = false;
      }
    });
  });
}, 30000);
