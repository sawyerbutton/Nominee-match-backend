import { Injectable } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingResultDto } from './dto/matching-result.dto';

interface TestUser {
  id: string;
  email: string;
  name: string;
  skills: string[];
  experience: string;
  interests: string;
  github?: string;
  linkedin?: string;
}

@Injectable()
export class MatchingService {
  private testUsers: TestUser[] = [
    {
      id: '1',
      email: 'test1@example.com',
      name: '测试用户1',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: '3',
      interests: 'Web开发,人工智能,区块链',
      github: 'https://github.com/test1',
      linkedin: 'https://linkedin.com/in/test1'
    },
    {
      id: '2',
      email: 'test2@example.com',
      name: '测试用户2',
      skills: ['Python', '机器学习', '数据分析'],
      experience: '5',
      interests: '人工智能,数据科学,云计算',
      github: 'https://github.com/test2',
      linkedin: 'https://linkedin.com/in/test2'
    },
    {
      id: '3',
      email: 'test3@example.com',
      name: '测试用户3',
      skills: ['Java', 'Spring Boot', '微服务'],
      experience: '4',
      interests: '后端开发,云原生,DevOps',
      github: 'https://github.com/test3',
      linkedin: 'https://linkedin.com/in/test3'
    }
  ];

  async findMatches(userId: string, createMatchingDto: CreateMatchingDto): Promise<MatchingResultDto[]> {
    // 获取所有其他用户
    const allUsers = this.testUsers.filter(user => user.id !== userId);
    
    // 计算匹配分数并排序
    const matches = allUsers.map(user => {
      const matchScore = this.calculateMatchScore(createMatchingDto, user);
      const complementarySkills = this.findComplementarySkills(createMatchingDto.skills, user.skills);
      const commonInterests = this.findCommonInterests(createMatchingDto.interests, user.interests);
      
      return {
        matchedUserId: user.id,
        matchScore,
        complementarySkills,
        commonInterests,
        experienceMatch: this.compareExperience(createMatchingDto.experience, user.experience),
        contactInfo: {
          email: user.email,
          github: user.github,
          linkedin: user.linkedin
        }
      };
    });

    // 按匹配分数排序并返回前5个最佳匹配
    return matches
      .filter(match => match.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  private calculateMatchScore(user1: CreateMatchingDto, user2: TestUser): number {
    let score = 0;
    
    // 技能互补度评分 (40%)
    const complementarySkills = this.findComplementarySkills(user1.skills, user2.skills);
    score += (complementarySkills.length / Math.max(user1.skills.length, user2.skills.length)) * 40;

    // 共同兴趣评分 (30%)
    const commonInterests = this.findCommonInterests(user1.interests, user2.interests);
    score += (commonInterests.length / Math.max(
      user1.interests.split(',').length,
      user2.interests.split(',').length
    )) * 30;

    // 经验匹配度评分 (30%)
    const experienceMatch = this.compareExperience(user1.experience, user2.experience);
    score += experienceMatch === 'high' ? 30 : experienceMatch === 'medium' ? 20 : 10;

    return score;
  }

  private findComplementarySkills(skills1: string[], skills2: string[]): string[] {
    // 找出互补的技能（对方有而自己没有的技能）
    return skills2.filter(skill => !skills1.includes(skill));
  }

  private findCommonInterests(interests1: string, interests2: string): string[] {
    const interests1Array = interests1.split(',').map(i => i.trim());
    const interests2Array = interests2.split(',').map(i => i.trim());
    return interests1Array.filter(interest => interests2Array.includes(interest));
  }

  private compareExperience(exp1: string, exp2: string): 'high' | 'medium' | 'low' {
    // 简单的经验比较逻辑，可以根据需要扩展
    const exp1Years = parseInt(exp1);
    const exp2Years = parseInt(exp2);
    
    if (Math.abs(exp1Years - exp2Years) <= 1) {
      return 'high';
    } else if (Math.abs(exp1Years - exp2Years) <= 3) {
      return 'medium';
    } else {
      return 'low';
    }
  }
} 