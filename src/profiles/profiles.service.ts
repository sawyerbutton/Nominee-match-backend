import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './interfaces/profile.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfilesService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'profiles.json');

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

  private readProfiles(): Profile[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writeProfiles(profiles: Profile[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(profiles, null, 2));
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profiles = this.readProfiles();
    
    // 检查钱包地址是否已存在
    const existingProfile = profiles.find(
      profile => profile.walletAddress.toLowerCase() === createProfileDto.walletAddress.toLowerCase()
    );
    
    if (existingProfile) {
      throw new Error('该钱包地址已存在个人档案');
    }

    const newProfile: Profile = {
      id: Date.now().toString(),
      ...createProfileDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    profiles.push(newProfile);
    this.writeProfiles(profiles);
    return newProfile;
  }

  async findAll(): Promise<Profile[]> {
    return this.readProfiles();
  }

  async findOne(walletAddress: string): Promise<Profile> {
    const profiles = this.readProfiles();
    const profile = profiles.find(
      profile => profile.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!profile) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的个人档案`);
    }

    return profile;
  }

  async update(walletAddress: string, updateProfileDto: Partial<CreateProfileDto>): Promise<Profile> {
    const profiles = this.readProfiles();
    const index = profiles.findIndex(
      profile => profile.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (index === -1) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的个人档案`);
    }

    // 如果更新了钱包地址，检查新地址是否已存在
    if (updateProfileDto.walletAddress && 
        updateProfileDto.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      const existingProfile = profiles.find(
        profile => profile.walletAddress.toLowerCase() === updateProfileDto.walletAddress.toLowerCase()
      );
      if (existingProfile) {
        throw new Error('该钱包地址已存在个人档案');
      }
    }

    profiles[index] = {
      ...profiles[index],
      ...updateProfileDto,
      updatedAt: new Date()
    };

    this.writeProfiles(profiles);
    return profiles[index];
  }

  async remove(walletAddress: string): Promise<void> {
    const profiles = this.readProfiles();
    const filteredProfiles = profiles.filter(
      profile => profile.walletAddress.toLowerCase() !== walletAddress.toLowerCase()
    );

    if (filteredProfiles.length === profiles.length) {
      throw new NotFoundException(`未找到钱包地址为 ${walletAddress} 的个人档案`);
    }

    this.writeProfiles(filteredProfiles);
  }
} 