# Payment Transfer Portal - Setup Guide

A secure payment transfer portal built with Next.js, Clerk authentication, Razorpay payments, and real-time WebSocket transfers.

## Features

- **Clerk Authentication**: Secure user authentication and management
- **100 Free Coins**: Every new user starts with 100 coins
- **Real-time Transfers**: Transfer coins to other users instantly via WebSocket
- **Razorpay Integration**: Purchase additional coins securely
- **Transaction History**: Track all your transfers and purchases
- **Responsive UI**: Modern, clean interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Payments**: Razorpay
- **Real-time**: Socket.io
- **Data Storage**: In-memory with JSON file persistence

## Prerequisites

- Node.js 18+ and pnpm installed
- Clerk account (free tier available)
- Razorpay account (test mode available)

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Clerk Authentication

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Navigate to API Keys section
4. Copy your Publishable Key and Secret Key

### 3. Set Up Razorpay

1. Go to [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Create an account or sign in
3. Navigate to Settings > API Keys
4. Generate test keys (or live keys for production)
5. Copy your Key ID and Key Secret

### 4. Configure Environment Variables

Update the `.env.local` file with your actual API keys:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_here
RAZORPAY_KEY_SECRET=your_actual_secret_here

# WebSocket Configuration (use your production URL in production)
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
pnpm build
pnpm start
```

## Usage Guide

### Creating an Account

1. Visit the homepage
2. Click "Get Started"
3. Sign up with your email
4. You'll automatically receive 100 free coins

### Transferring Coins

1. Log in to your dashboard
2. Enter the recipient's email address
3. Enter the amount of coins to transfer
4. Click "Send Coins"
5. Both you and the recipient will see the balance update in real-time

### Purchasing Coins

1. Click "Buy Coins" in the dashboard
2. Choose a coin package:
   - 100 coins for ₹100
   - 500 coins for ₹450 (10% discount)
   - 1000 coins for ₹850 (15% discount)
3. Complete payment via Razorpay
4. Coins are added instantly after successful payment

### Testing Payments

For testing Razorpay in test mode, use these test cards:

- **Successful payment**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Name**: Any name

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── payment/          # Razorpay order creation & verification
│   │   ├── transfer/         # Coin transfer logic
│   │   └── user/            # User balance & transactions
│   ├── dashboard/           # Main dashboard page
│   ├── purchase/            # Coin purchase page
│   ├── sign-up/             # Sign up page
│   ├── login/               # Login page
│   └── page.tsx             # Landing page
├── components/
│   ├── BalanceDisplay.tsx   # Real-time balance component
│   ├── TransferForm.tsx     # Transfer coins form
│   └── TransactionHistory.tsx # Transaction list
├── lib/
│   ├── db.ts                # In-memory database
│   └── websocket.ts         # WebSocket utilities
├── types/
│   └── index.ts             # TypeScript interfaces
├── server.js                # Custom server with Socket.io
└── middleware.ts            # Clerk authentication middleware
```

## API Routes

### User APIs
- `GET /api/user/balance` - Get current user balance
- `POST /api/user/initialize` - Initialize new user with 100 coins
- `GET /api/user/transactions` - Get user transaction history

### Payment APIs
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature

### Transfer API
- `POST /api/transfer` - Transfer coins between users

## WebSocket Events

### Client → Server
- `join` - Join user-specific room

### Server → Client
- `balance-update` - Balance changed
- `transfer-sent` - Coins sent successfully
- `transfer-received` - Coins received

## Data Persistence

The application uses an in-memory database that persists to `data/db.json`. This means:

- Data survives server restarts
- No external database required
- Suitable for demo/development
- For production, consider using a real database (PostgreSQL, MongoDB, etc.)

## Security Notes

1. All payments are verified server-side using Razorpay signature verification
2. User authentication is handled by Clerk with secure sessions
3. API routes are protected by authentication middleware
4. Transfer operations use atomic updates to prevent race conditions
5. Never expose secret keys in client-side code

## Limitations

1. In-memory database - not suitable for high-traffic production
2. No user email verification required (handled by Clerk settings)
3. No withdrawal feature - coins can only be transferred or purchased
4. WebSocket connections may need reconnection logic for production

## Troubleshooting

### Build Errors

If you see Clerk key validation errors during build:
- Ensure your keys are in the correct format (pk_test_... and sk_test_...)
- Check that .env.local is in the root directory

### WebSocket Connection Issues

If real-time updates don't work:
- Check that the custom server is running (not `next dev`)
- Verify NEXT_PUBLIC_WEBSOCKET_URL matches your server URL
- Check browser console for connection errors

### Payment Failures

If payments fail:
- Ensure you're using test keys in test mode
- Check Razorpay dashboard for payment logs
- Verify signature verification is working in /api/payment/verify

## Support

For issues related to:
- **Authentication**: Check [Clerk Documentation](https://clerk.com/docs)
- **Payments**: Check [Razorpay Documentation](https://razorpay.com/docs/)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)

## License

This project is for educational and demonstration purposes.
