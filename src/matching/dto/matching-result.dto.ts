export class MatchingResultDto {
  matchedUserId: string;
  matchScore: number;
  complementarySkills: string[];
  commonInterests: string[];
  experienceMatch: string;
  contactInfo: {
    email: string;
    github?: string;
    linkedin?: string;
  };
} 