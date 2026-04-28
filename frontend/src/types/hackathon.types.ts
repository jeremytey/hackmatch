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