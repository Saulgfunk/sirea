import { api } from './client';
import type {
  AstrologerProfile,
  AuthResponse,
  FeedResponse,
  Session,
  WalletAccount,
  WalletTransaction,
} from './types';

export const sireaApi = {
  auth: {
    signup: (data: { email?: string; phone?: string; password: string; displayName?: string }) =>
      api<AuthResponse>('/auth/signup', { method: 'POST', body: data, auth: false }),
    login: (data: { email?: string; phone?: string; password: string }) =>
      api<AuthResponse>('/auth/login', { method: 'POST', body: data, auth: false }),
    me: () => api<AuthResponse['user']>('/auth/me'),
  },
  feed: {
    get: () => api<FeedResponse>('/feed'),
  },
  astrologers: {
    list: () => api<AstrologerProfile[]>('/astrologers'),
    get: (id: string) => api<AstrologerProfile>(`/astrologers/${id}`),
    follow: (id: string) => api<void>(`/astrologers/${id}/follow`, { method: 'POST' }),
    availability: (id: string) => api<Session[]>(`/astrologers/${id}/availability`),
  },
  sessions: {
    join: (id: string) => api<void>(`/sessions/${id}/join`, { method: 'POST' }),
  },
  wallet: {
    get: () => api<WalletAccount>('/wallet'),
    transactions: () => api<WalletTransaction[]>('/wallet/transactions'),
  },
  profile: {
    setBirthData: (data: { birthDate: string; birthTime?: string; birthPlace?: string }) =>
      api('/profile/birth-data', { method: 'POST', body: data }),
  },
};
