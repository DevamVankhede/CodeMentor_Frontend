# Real-Time Collaboration Guide

## How It Works

The collaboration system allows multiple users to code together in real-time using WebSocket connections.

### Key Concepts

1. **Room ID**: A unique identifier that connects users to the same collaboration session
2. **Session**: A collaboration workspace with metadata (name, description, language)
3. **WebSocket Server**: Handles real-time synchronization between all participants

## How to Use

### Creating a Session

1. Click "Create New Session" on the collaborate page
2. Fill in session details (name, description, language)
3. Click "Create Session"
4. You'll automatically join the session and get a **Room ID**

### Joining a Session

There are 3 ways to join:

1. **Copy Link Button**: Click "Copy Link" on any session card, then share the link
2. **Join with Code**: Click "Join with Code" and enter the Room ID
3. **Direct Link**: Use the URL format: `https://your-domain.com/collaborate?join=ROOM_ID`

### Important: Room ID vs Session ID

- **Session ID**: Internal identifier (e.g., `session-1733155200000-abc123`)
- **Room ID**: Shareable identifier used for WebSocket connections (e.g., `1733155200000-abc123`)

When sharing sessions, always use the **Room ID** so everyone connects to the same WebSocket room.

## How Multiple Users Join the Same Room

### Step-by-Step Flow

1. **User A creates a session**
   - System generates: `roomId = "1733155200000-abc123"`
   - User A joins WebSocket room: `"1733155200000-abc123"`

2. **User A shares the link**
   - Link contains: `?join=1733155200000-abc123`
   - This is the **Room ID**, not the session ID

3. **User B clicks the link**
   - System reads `?join=1733155200000-abc123`
   - Finds the session with matching `roomId`
   - User B joins the same WebSocket room: `"1733155200000-abc123"`

4. **Both users are now in the same room!**
   - They see each other's code changes in real-time
   - They can chat together
   - They see each other in the participants list

## Troubleshooting

### Users Joining Different Rooms

**Problem**: Logs show users joining room 6, room 7, etc. instead of the same room.

**Cause**: Users are not using the shared Room ID.

**Solution**: 
- Always use the "Copy Link" button to share sessions
- Make sure the URL parameter `?join=` contains the Room ID
- Verify both users see the same Room ID in the browser console

### Connection Issues

**Problem**: "Connecting to collaboration server..." message persists.

**Cause**: WebSocket server is not running or URL is incorrect.

**Solution**:
- Check that `collaboration-server.js` is running
- Verify `NEXT_PUBLIC_WS_URL` environment variable is set correctly
- For production: Use `wss://your-websocket-server.com`
- For local: Use `ws://localhost:8080`

## Server Logs

When working correctly, you should see:

```
✅ User123 joined room 1733155200000-abc123
✅ User456 joined room 1733155200000-abc123
```

Both users should have the **same room number**.

## Testing Locally

1. Start the WebSocket server:
   ```bash
   node collaboration-server.js
   ```

2. Open two browser windows:
   - Window 1: Create a session
   - Window 1: Click "Copy Link"
   - Window 2: Paste the link and press Enter
   - Both windows should now be in the same room!

3. Test real-time sync:
   - Type in the code editor in Window 1
   - You should see the changes appear in Window 2
   - Try sending chat messages

## Production Deployment

1. Deploy WebSocket server to Render/Heroku/etc.
2. Set environment variable:
   ```
   NEXT_PUBLIC_WS_URL=wss://your-websocket-server.onrender.com
   ```
3. Share session links with your team
4. Everyone connects to the same production WebSocket server

## Code Changes Made

### Fixed Issues

1. **Room ID Consistency**: Now uses `session.roomId` instead of `session.id` for WebSocket connections
2. **Link Sharing**: Copy Link button now shares the Room ID, not the Session ID
3. **Join Logic**: Updated to find sessions by both `id` and `roomId`
4. **Simplified Room IDs**: Removed redundant "room-" prefix for cleaner IDs

### Key Files Modified

- `src/app/collaborate/page.tsx`: Fixed session joining and link sharing logic
- `collaboration-server.js`: Already working correctly
- `src/components/collaboration/SimpleCollaborationHub.tsx`: Already working correctly

## Success Indicators

✅ Server logs show same room ID for multiple users
✅ Users see each other in the participants list
✅ Code changes sync in real-time
✅ Chat messages appear for all users
✅ "Copy Link" button shares the correct Room ID

Now your collaboration system is ready for multiple users! 🎉
