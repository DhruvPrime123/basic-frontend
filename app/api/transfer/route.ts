import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toEmail, amount } = body;

    if (!toEmail || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const db = getDatabase();
    const fromUser = db.getUser(userId);
    const toUser = db.getUserByEmail(toEmail);

    if (!fromUser) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    if (!toUser) {
      return NextResponse.json({ error: 'Recipient not found. They need to sign up first.' }, { status: 404 });
    }

    if (fromUser.email === toEmail) {
      return NextResponse.json({ error: 'Cannot transfer to yourself' }, { status: 400 });
    }

    const result = await db.transfer(userId, toUser.userId, amount);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Notify via WebSocket
    if (global.io) {
      const updatedFromUser = db.getUser(userId);
      const updatedToUser = db.getUser(toUser.userId);

      if (updatedFromUser) {
        global.io.to(`user:${userId}`).emit('balance-update', { balance: updatedFromUser.coins });
        global.io.to(`user:${userId}`).emit('transfer-sent', {
          amount,
          transaction: result.transaction,
          toEmail: toUser.email
        });
      }

      if (updatedToUser) {
        global.io.to(`user:${toUser.userId}`).emit('balance-update', { balance: updatedToUser.coins });
        global.io.to(`user:${toUser.userId}`).emit('transfer-received', {
          amount,
          transaction: result.transaction,
          fromEmail: fromUser.email
        });
      }
    }

    const updatedFromUser = db.getUser(userId);

    return NextResponse.json({
      success: true,
      message: result.message,
      transaction: result.transaction,
      newBalance: updatedFromUser?.coins || 0
    });
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json({ error: 'Failed to process transfer' }, { status: 500 });
  }
}
