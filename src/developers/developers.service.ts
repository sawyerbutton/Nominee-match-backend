import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { Developer } from './interfaces/developer.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DevelopersService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'developers.json');

  constructor() {
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

  private readDevelopers(): Developer[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writeDevelopers(developers: Developer[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(developers, null, 2));
  }

  async create(createDeveloperDto: CreateDeveloperDto): Promise<Developer> {
    const developers = this.readDevelopers();
    
    // 检查钱包地址是否已存在
    const existingDeveloper = developers.find(
      dev => dev.walletAddress.toLowerCase() === createDeveloperDto.walletAddress.toLowerCase()
    );
    
    if (existingDeveloper) {
      throw new Error('该钱包地址已被注册');
    }

    const newDeveloper: Developer = {
      id: Date.now().toString(),
      ...createDeveloperDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    developers.push(newDeveloper);
    this.writeDevelopers(developers);
    return newDeveloper;
  }

  async findAll(): Promise<Developer[]> {
    return this.readDevelopers();
  }

  async findOne(walletAddress: string): Promise<Developer> {
    const developers = this.readDevelopers();
    const developer = developers.find(
      dev => dev.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!developer) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的开发者`);
    }

    return developer;
  }

  async update(walletAddress: string, updateDeveloperDto: Partial<CreateDeveloperDto>): Promise<Developer> {
    const developers = this.readDevelopers();
    const index = developers.findIndex(
      dev => dev.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (index === -1) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的开发者`);
    }

    // 如果更新了钱包地址，检查新地址是否已存在
    if (updateDeveloperDto.walletAddress && 
        updateDeveloperDto.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      const existingDeveloper = developers.find(
        dev => dev.walletAddress.toLowerCase() === updateDeveloperDto.walletAddress.toLowerCase()
      );
      if (existingDeveloper) {
        throw new Error('该钱包地址已被注册');
      }
    }

    developers[index] = {
      ...developers[index],
      ...updateDeveloperDto,
      updatedAt: new Date()
    };

    this.writeDevelopers(developers);
    return developers[index];
  }

  async remove(walletAddress: string): Promise<void> {
    const developers = this.readDevelopers();
    const filteredDevelopers = developers.filter(
      dev => dev.walletAddress.toLowerCase() !== walletAddress.toLowerCase()
    );

    if (filteredDevelopers.length === developers.length) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的开发者`);
    }

    this.writeDevelopers(filteredDevelopers);
  }
} 