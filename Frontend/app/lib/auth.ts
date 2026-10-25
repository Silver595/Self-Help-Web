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

let currentUserRequest: Promise<User> | null = null;

export const getCurrentUser = (): Promise<User> => {
  if (!currentUserRequest) {
    currentUserRequest = api<User>('/users/current-user').finally(
      () => {
        currentUserRequest = null;
      },
    );
  }

  return currentUserRequest;
};

export const logoutRequest = () => api('/users/logout', { method: 'POST' });
