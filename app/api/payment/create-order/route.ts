import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Coin packages
const COIN_PACKAGES = {
  100: { amount: 10000, coins: 100 },   // ₹100 for 100 coins
  500: { amount: 45000, coins: 500 },   // ₹450 for 500 coins (10% discount)
  1000: { amount: 85000, coins: 1000 }, // ₹850 for 1000 coins (15% discount)
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { coins } = body;

    const packageInfo = COIN_PACKAGES[coins as keyof typeof COIN_PACKAGES];

    if (!packageInfo) {
      return NextResponse.json({ error: 'Invalid coin package' }, { status: 400 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: packageInfo.amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        coins: packageInfo.coins.toString(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      coins: packageInfo.coins,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
