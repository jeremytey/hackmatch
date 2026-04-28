export type TeamStatus = 'LOOKING' | 'NEED_MEMBERS' | 'FULL';

export interface Hackathon {
  id: number;
  name: string;
  description: string;
  startDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  externalUrl?: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// For creating or updating hackathons
export interface HackathonFormData {
  name: string;
  description: string;
  startDate: string; 
  registrationDeadline: string;
  maxTeamSize: number;
  externalUrl?: string;
}



export interface Participant {
  id: number;
  hackathonId: number;
  teamStatus: TeamStatus;
  spotsAvailable?: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    university: string | null;
    yearOfStudy: number | null;
    role: 'DEVELOPER' | 'DESIGNER' | 'PRODUCT_MANAGER' | 'RESEARCHER' | null;
    bio: string | null;
    githubURL: string | null;
    linkedinURL: string | null;
    preferredContact: string | null;
    avatarURL: string | null;
    skills: { id: number; name: string; category: string; }[];
  };
}