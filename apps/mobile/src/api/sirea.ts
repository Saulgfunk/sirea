import { api } from './client';
import type {
  AstrologerProfile,
  AuthResponse,
  FeedResponse,
  GroupSession,
  KahveFaliOrder,
  Post,
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
    create: (data: { bio?: string; specialties: string[]; languages: string[] }) =>
      api<AstrologerProfile>('/astrologers', { method: 'POST', body: data }),
    follow: (id: string) => api<void>(`/astrologers/${id}/follow`, { method: 'POST' }),
    availability: (id: string) => api<Session[]>(`/astrologers/${id}/availability`),
    createPost: (id: string, data: { type: 'text' | 'image' | 'video'; body?: string; mediaUrl?: string }) =>
      api<Post>(`/astrologers/${id}/posts`, { method: 'POST', body: data }),
  },
  sessions: {
    create: (data: {
      type: 'private' | 'group' | 'kahve_fali_live';
      scheduledAt: string;
      durationMinutes: number;
      price: number;
      paymentModel: 'bundled' | 'a_la_carte';
    }) => api<Session>('/sessions', { method: 'POST', body: data }),
    join: (id: string) => api<void>(`/sessions/${id}/join`, { method: 'POST' }),
  },
  groupSessions: {
    list: () => api<GroupSession[]>('/group-sessions'),
    join: (id: string) => api<void>(`/group-sessions/${id}/join`, { method: 'POST' }),
  },
  kahveFali: {
    createOrder: (data: { astrologerId: string; photoUrl: string }) =>
      api<KahveFaliOrder>('/kahve-fali/orders', { method: 'POST', body: data }),
    getOrder: (id: string) => api<KahveFaliOrder>(`/kahve-fali/orders/${id}`),
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
