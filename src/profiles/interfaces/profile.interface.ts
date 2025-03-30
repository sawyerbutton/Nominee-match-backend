export interface Profile {
  id: string;
  walletAddress: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 