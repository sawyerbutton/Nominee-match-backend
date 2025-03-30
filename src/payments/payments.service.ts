import { Injectable, NotFoundException } from '@nestjs/common';
import { ethers } from 'ethers';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './interfaces/payment.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PaymentsService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'payments.json');
  private readonly provider: ethers.Provider;
  private readonly requiredConfirmations = 1; // 区块确认数

  constructor() {
    // 初始化以太坊提供者
    this.provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL || 'http://localhost:8545');

    // 确保数据目录存在
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // 确保数据文件存在
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  private readPayments(): Payment[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writePayments(payments: Payment[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(payments, null, 2));
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payments = this.readPayments();
    
    // 检查是否已有待处理的支付
    const existingPendingPayment = payments.find(
      payment => payment.walletAddress.toLowerCase() === createPaymentDto.walletAddress.toLowerCase() 
        && payment.status === 'pending'
    );
    
    if (existingPendingPayment) {
      throw new Error('已有待处理的支付请求');
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      ...createPaymentDto,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    payments.push(newPayment);
    this.writePayments(payments);

    // 开始监控交易状态
    this.monitorPaymentStatus(newPayment.id);

    return newPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.readPayments();
  }

  async findOne(walletAddress: string): Promise<Payment> {
    const payments = this.readPayments();
    const payment = payments.find(
      payment => payment.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!payment) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的支付记录`);
    }

    return payment;
  }

  async getPaymentStatus(walletAddress: string): Promise<PaymentStatus> {
    const payment = await this.findOne(walletAddress);
    
    if (payment.status === 'pending' && payment.transactionHash) {
      // 检查交易状态
      try {
        const receipt = await this.provider.getTransactionReceipt(payment.transactionHash);
        if (receipt) {
          const currentBlock = await this.provider.getBlockNumber();
          const confirmations = currentBlock - receipt.blockNumber;

          if (confirmations >= this.requiredConfirmations) {
            // 更新支付状态为已确认
            await this.updatePaymentStatus(payment.id, 'confirmed');
            return {
              status: 'confirmed',
              transactionHash: payment.transactionHash,
              amount: payment.amount,
              timestamp: new Date()
            };
          }
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        // 如果交易不存在，更新状态为失败
        await this.updatePaymentStatus(payment.id, 'failed');
        return {
          status: 'failed',
          transactionHash: payment.transactionHash
        };
      }
    }

    return {
      status: payment.status,
      transactionHash: payment.transactionHash,
      amount: payment.amount,
      timestamp: payment.updatedAt
    };
  }

  private async updatePaymentStatus(paymentId: string, status: Payment['status']): Promise<void> {
    const payments = this.readPayments();
    const index = payments.findIndex(payment => payment.id === paymentId);

    if (index !== -1) {
      payments[index] = {
        ...payments[index],
        status,
        updatedAt: new Date()
      };
      this.writePayments(payments);
    }
  }

  private async monitorPaymentStatus(paymentId: string): Promise<void> {
    const payments = this.readPayments();
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) return;

    // 每30秒检查一次交易状态
    const interval = setInterval(async () => {
      try {
        const status = await this.getPaymentStatus(payment.walletAddress);
        if (status.status !== 'pending') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error monitoring payment status:', error);
        clearInterval(interval);
      }
    }, 30000);

    // 5分钟后停止监控
    setTimeout(() => {
      clearInterval(interval);
    }, 300000);
  }
} 