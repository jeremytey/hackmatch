import axiosInstance from './axiosInstance';
import type { Hackathon } from '../types/hackathon.types'; // We'll define this next


// Fetches all hackathons from the database. GET /hackathons
export const getAllHackathons = async (): Promise<Hackathon[]> => {
  const { data } = await axiosInstance.get<Hackathon[]>('/hackathons');
  return data;
};