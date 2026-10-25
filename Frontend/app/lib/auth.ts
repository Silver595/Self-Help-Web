import { api } from './api';

export interface User {
  _id: string;
  fullname: string;
  email: string;
  username: string;
}

export const loginRequest = (email: string, password: string) =>
  api<{ user: User }>('/users/login', { method: 'POST', body: { email, password } });

export const registerRequest = (data: {
  fullname: string;
  email: string;
  username: string;
  password: string;
}) => api<User>('/users/register', { method: 'POST', body: data });

export const getCurrentUser = () => api<User>('/users/current-user');

export const logoutRequest = () => api('/users/logout', { method: 'POST' });
