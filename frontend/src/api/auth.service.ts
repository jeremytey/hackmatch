// use axios instance with interceptors to map components to backend auth routes
import axiosInstance from './axiosInstance';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';


// Sends credentials to backend and returns user data + access token. POST /auth/login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
  return data;
};


// Registers a new user. POST /auth/register
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
  return data;
};


//  Clears session on backend (clears httpOnly cookie). POST /auth/logout
export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};