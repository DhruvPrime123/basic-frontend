export interface User {
  userId: string;
  email: string;
  coins: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: 'transfer' | 'purchase';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface TransferRequest {
  toEmail: string;
  amount: number;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  coins: number;
}
