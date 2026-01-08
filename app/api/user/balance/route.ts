import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDatabase();
    let user = db.getUser(userId);

    // Auto-initialize user if doesn't exist
    if (!user) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || `user_${userId}@temp.com`;
      user = db.createUser(userId, email);
    }

    return NextResponse.json({
      coins: user.coins,
      userId: user.userId,
      email: user.email
    });
  } catch (error) {
    console.error('Get balance error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
