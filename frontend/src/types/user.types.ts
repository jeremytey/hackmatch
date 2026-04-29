export interface UserProfile {
  id: number;
  username: string;
  email: string;
  university: string | null;
  yearOfStudy: number | null;
  role: 'DEVELOPER' | 'DESIGNER' | 'PRODUCT_MANAGER' | 'RESEARCHER' | null;
  bio: string | null;
  githubURL: string | null;
  linkedinURL: string | null;
  preferredContact: string | null;
  avatarURL: string | null;
  createdAt: string;
  updatedAt: string;
  skills: { id: number; name: string; category: string; }[];
}

export interface UpdateUserDto {
  university?: string;
  role?: 'DEVELOPER' | 'DESIGNER' | 'PRODUCT_MANAGER' | 'RESEARCHER';
  bio?: string;
  skills?: number[]; 
}