export interface Payment {
  id: string;
  walletAddress: string;
  amount: string; // ETH amount in wei
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentStatus {
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  amount?: string;
  timestamp?: Date;
} 