import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDatabase();
    let user = db.getUser(userId);

    // If user doesn't exist, create with 100 initial coins
    if (!user) {
      // Get email from Clerk (would need Clerk SDK for this, for now use placeholder)
      const email = `user_${userId}@temp.com`; // In production, get from Clerk user object
      user = db.createUser(userId, email);
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Initialize user error:', error);
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 });
  }
}
