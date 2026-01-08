import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initWebSocket(httpServer: HTTPServer) {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join', (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function notifyBalanceUpdate(userId: string, newBalance: number) {
  if (io) {
    io.to(`user:${userId}`).emit('balance-update', { balance: newBalance });
  }
}

export function notifyTransfer(fromUserId: string, toUserId: string, amount: number, transaction: any) {
  if (io) {
    io.to(`user:${fromUserId}`).emit('transfer-sent', { amount, transaction, toUserId });
    io.to(`user:${toUserId}`).emit('transfer-received', { amount, transaction, fromUserId });
  }
}
