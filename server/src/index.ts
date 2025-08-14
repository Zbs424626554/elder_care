// server/src/index.ts
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import emergencyRoutes from './routes/emergency.routes';
import userRoutes from './routes/users.routes';
import healthRoutes from './routes/health.routes';
import elderHealthRoutes from './routes/elderhealth.routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { initSocket } from './config/socket';
import { WebSocket, WebSocketServer } from "ws";
import messageRoutes from "./routes/ZBS/message";
import userRoutesZBS from "./routes/ZBS/users";
import elderHealthRoutesZBS from "./routes/ZBS/elderhealth";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes(io));
app.use('/api/users', userRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/elderhealth', elderHealthRoutes);
app.use("/api", messageRoutes);
app.use("/api", userRoutesZBS);
app.use("/api", elderHealthRoutesZBS);

// WebSocket服务器设置
const wss = new WebSocketServer({
  server,
  path: "/ws",
});

// 存储用户连接
interface UserConnection {
  ws: WebSocket;
  username: string;
  lastSeen: number;
}

const userConnections = new Map<string, UserConnection>();
const conversationUsers = new Map<string, Set<string>>(); // conversationId -> Set of usernames

// WebSocket连接处理
wss.on("connection", (ws: WebSocket, req) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const username = url.searchParams.get("username");

  if (!username) {
    ws.close(1008, "Username required");
    return;
  }

  console.log(`用户 ${username} 已连接WebSocket`);

  // 存储用户连接
  userConnections.set(username, {
    ws,
    username,
    lastSeen: Date.now(),
  });

  // 发送连接确认
  ws.send(
    JSON.stringify({
      type: "connected",
      data: { username, timestamp: Date.now() },
    })
  );

  // 处理消息
  ws.on("message", (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      handleWebSocketMessage(username, message);
    } catch (error) {
      console.error("WebSocket消息解析错误:", error);
    }
  });

  // 处理断开连接
  ws.on("close", () => {
    console.log(`用户 ${username} 断开WebSocket连接`);
    userConnections.delete(username);

    // 从所有会话中移除用户
    conversationUsers.forEach((users, conversationId) => {
      if (users.has(username)) {
        users.delete(username);
        if (users.size === 0) {
          conversationUsers.delete(conversationId);
        }
      }
    });
  });

  // 处理错误
  ws.on("error", (error) => {
    console.error(`WebSocket错误 (${username}):`, error);
  });
});

// 处理WebSocket消息
function handleWebSocketMessage(senderUsername: string, message: any) {
  const { type, data, conversationId } = message;

  switch (type) {
    case "message":
      // 聊天消息
      if (conversationId && data.receivers) {
        // 将发送者添加到会话用户列表
        if (!conversationUsers.has(conversationId)) {
          conversationUsers.set(conversationId, new Set());
        }
        conversationUsers.get(conversationId)!.add(senderUsername);

        // 广播消息到接收者
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "message",
                data: {
                  id: `ws_${Date.now()}_${Math.random()}`,
                  conversationId,
                  sender: senderUsername,
                  content: data.content,
                  sendTime: data.sendTime || Date.now(),
                  type: data.type || "text",
                  receivers: data.receivers,
                },
              })
            );
          }
        });
      }
      break;

    case "typing":
    case "stop_typing":
      // 打字状态
      if (conversationId) {
        const conversationUserSet = conversationUsers.get(conversationId);
        if (conversationUserSet) {
          conversationUserSet.forEach((username) => {
            if (username !== senderUsername) {
              const userConn = userConnections.get(username);
              if (userConn && userConn.ws.readyState === WebSocket.OPEN) {
                userConn.ws.send(
                  JSON.stringify({
                    type,
                    data: {
                      conversationId,
                      username: senderUsername,
                    },
                  })
                );
              }
            }
          });
        }
      }
      break;

    case "ping":
      // 心跳回应
      const senderConn = userConnections.get(senderUsername);
      if (senderConn && senderConn.ws.readyState === WebSocket.OPEN) {
        senderConn.ws.send(
          JSON.stringify({
            type: "pong",
            data: { timestamp: Date.now() },
          })
        );
        senderConn.lastSeen = Date.now();
      }
      break;

    case "user_online":
      // 用户上线通知
      broadcastUserStatus(senderUsername, "online");
      break;

    case "user_offline":
      // 用户下线通知
      broadcastUserStatus(senderUsername, "offline");
      break;

    case "call_invite":
      // 电话邀请
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "call_invite",
                data: {
                  conversationId: data.conversationId,
                  callType: data.callType,
                  caller: senderUsername,
                  callerName: data.callerName || senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    case "call_response":
      // 电话响应
      if (data.caller) {
        const callerConn = userConnections.get(data.caller);
        if (callerConn && callerConn.ws.readyState === WebSocket.OPEN) {
          callerConn.ws.send(
            JSON.stringify({
              type: "call_response",
              data: {
                conversationId: data.conversationId,
                response: data.response,
                responder: senderUsername,
                timestamp: Date.now(),
              },
              conversationId: data.conversationId,
              sender: senderUsername,
              timestamp: Date.now(),
            })
          );
        }
      }
      break;

    case "call_cancel":
      // 取消通话
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "call_cancel",
                data: {
                  conversationId: data.conversationId,
                  sender: senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    case "call_end":
      // 挂断通话
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "call_end",
                data: {
                  conversationId: data.conversationId,
                  sender: senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    case "webrtc_offer":
      // WebRTC Offer
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "webrtc_offer",
                data: {
                  conversationId: data.conversationId,
                  offer: data.offer,
                  sender: senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    case "webrtc_answer":
      // WebRTC Answer
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "webrtc_answer",
                data: {
                  conversationId: data.conversationId,
                  answer: data.answer,
                  sender: senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    case "webrtc_ice_candidate":
      // WebRTC ICE Candidate
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "webrtc_ice_candidate",
                data: {
                  conversationId: data.conversationId,
                  candidate: data.candidate,
                  sender: senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    case "conversation_updated":
      // 会话更新通知
      if (data.receivers) {
        data.receivers.forEach((receiverUsername: string) => {
          const receiverConn = userConnections.get(receiverUsername);
          if (receiverConn && receiverConn.ws.readyState === WebSocket.OPEN) {
            receiverConn.ws.send(
              JSON.stringify({
                type: "conversation_updated",
                data: {
                  conversationId: data.conversationId,
                  sender: senderUsername,
                  timestamp: Date.now(),
                },
                conversationId: data.conversationId,
                sender: senderUsername,
                timestamp: Date.now(),
              })
            );
          }
        });
      }
      break;

    default:
      console.log(`未知消息类型: ${type}`);
  }
}

// 广播用户状态
function broadcastUserStatus(username: string, status: "online" | "offline") {
  const statusMessage = JSON.stringify({
    type: `user_${status}`,
    data: { username, timestamp: Date.now() },
  });

  userConnections.forEach((conn, connUsername) => {
    if (connUsername !== username && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(statusMessage);
    }
  });
}

// 广播对话创建事件
export function broadcastConversationCreated(conversationData: any) {
  const message = JSON.stringify({
    type: "conversation_created",
    data: conversationData,
    timestamp: Date.now(),
  });

  // 向对话参与者广播
  if (conversationData.participants) {
    conversationData.participants.forEach((username: string) => {
      const userConn = userConnections.get(username);
      if (userConn && userConn.ws.readyState === WebSocket.OPEN) {
        userConn.ws.send(message);
      }
    });
  }
}

// 广播对话更新事件（有新消息时）
export function broadcastConversationUpdated(conversationData: any) {
  const message = JSON.stringify({
    type: "conversation_updated",
    data: conversationData,
    timestamp: Date.now(),
  });

  // 向对话参与者广播
  if (conversationData.participants) {
    conversationData.participants.forEach((username: string) => {
      const userConn = userConnections.get(username);
      if (userConn && userConn.ws.readyState === WebSocket.OPEN) {
        userConn.ws.send(message);
      }
    });
  }
}

// 清理不活跃连接
setInterval(() => {
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5分钟超时

  userConnections.forEach((conn, username) => {
    if (now - conn.lastSeen > timeout) {
      console.log(`清理不活跃连接: ${username}`);
      conn.ws.close();
      userConnections.delete(username);
    }
  });
}, 60000); // 每分钟检查一次

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);

});