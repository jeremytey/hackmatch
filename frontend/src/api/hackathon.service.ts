import axiosInstance from './axiosInstance';
import type { Hackathon, Participant, HackathonFormData } from '../types/hackathon.types'; 

export const createHackathon = async (data: HackathonFormData): Promise<Hackathon> => {
  const { data: responseData } = await axiosInstance.post<Hackathon>('/hackathons', data);
  return responseData;
};

export const updateHackathon = async (id: number, data: HackathonFormData): Promise<Hackathon> => {
  const { data: responseData } = await axiosInstance.put<Hackathon>(`/hackathons/${id}`, data);
  return responseData;
};

// Fetches all hackathons from the database. GET /hackathons
export const getAllHackathons = async (): Promise<Hackathon[]> => {
  const { data } = await axiosInstance.get<Hackathon[]>('/hackathons');
  return data;
};

// Fetches a single hackathon details by ID
export const getHackathonById = async (id: number): Promise<Hackathon> => {
  const { data } = await axiosInstance.get<Hackathon>(`/hackathons/${id}`);
  return data;
};

// Fetches all participants for a specific hackathon
export const getParticipantsByHackathonId = async (hackathonId: number): Promise<Participant[]> => {
  const { data } = await axiosInstance.get<Participant[]>(`/hackathons/${hackathonId}/participants`);
  return data;
};

// Join a hackathon by providing the hackathon ID and team status. POST /hackathons/:id/join
export const joinHackathon = async (hackathonId: number): Promise<void> => {
  await axiosInstance.post(`/hackathons/${hackathonId}/join`);
};

// Leave a hackathon. POST /hackathons/:id/leave
export const leaveHackathon = async (hackathonId: number): Promise<void> => {
  await axiosInstance.delete(`/hackathons/${hackathonId}/leave`);
};