import { User, Transaction } from '@/types';
import fs from 'fs';
import path from 'path';

// In-memory storage
class Database {
  private users: Map<string, User> = new Map();
  private transactions: Transaction[] = [];
  private dataFilePath: string;

  constructor() {
    this.dataFilePath = path.join(process.cwd(), 'data', 'db.json');
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const data = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf-8'));
        this.users = new Map(
          data.users.map((u: User) => [u.userId, { ...u, createdAt: new Date(u.createdAt) }])
        );
        this.transactions = data.transactions.map((t: Transaction) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private saveData() {
    try {
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = {
        users: Array.from(this.users.values()),
        transactions: this.transactions
      };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User operations
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  createUser(userId: string, email: string): User {
    const user: User = {
      userId,
      email,
      coins: 100, // Initial 100 coins
      createdAt: new Date()
    };
    this.users.set(userId, user);
    this.saveData();
    return user;
  }

  updateUserCoins(userId: string, coins: number): User | null {
    const user = this.users.get(userId);
    if (!user) return null;
    user.coins = coins;
    this.users.set(userId, user);
    this.saveData();
    return user;
  }

  // Transaction operations
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.saveData();
  }

  getTransactionsByUserId(userId: string): Transaction[] {
    return this.transactions.filter(
      t => t.fromUserId === userId || t.toUserId === userId
    );
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id);
  }

  updateTransactionStatus(id: string, status: 'pending' | 'completed' | 'failed'): void {
    const transaction = this.transactions.find(t => t.id === id);
    if (transaction) {
      transaction.status = status;
      this.saveData();
    }
  }

  // Transfer with atomic operation
  async transfer(fromUserId: string, toUserId: string, amount: number): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
    const fromUser = this.users.get(fromUserId);
    const toUser = this.users.get(toUserId);

    if (!fromUser) {
      return { success: false, message: 'Sender not found' };
    }

    if (!toUser) {
      return { success: false, message: 'Recipient not found' };
    }

    if (fromUser.coins < amount) {
      return { success: false, message: 'Insufficient coins' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }

    // Atomic transfer
    fromUser.coins -= amount;
    toUser.coins += amount;

    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId,
      toUserId,
      amount,
      type: 'transfer',
      status: 'completed',
      timestamp: new Date()
    };

    this.users.set(fromUserId, fromUser);
    this.users.set(toUserId, toUser);
    this.transactions.push(transaction);
    this.saveData();

    return { success: true, message: 'Transfer completed', transaction };
  }
}

// Singleton instance
let dbInstance: Database | null = null;

export function getDatabase(): Database {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}
