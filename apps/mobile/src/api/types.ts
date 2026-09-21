// Mirrors apps/backend's Prisma models closely enough for the mobile client —
// hand-kept in sync, not generated. Revisit with a shared package if drift
// becomes a real problem.

export type BadgeType = 'verified_pro' | 'top_rated';

export type Badge = {
  id: string;
  astrologerId: string;
  type: BadgeType;
  grantedVia: 'application' | 'platform_direct';
  grantedAt: string;
  revokedAt: string | null;
};

export type AstrologerProfile = {
  userId: string;
  bio: string | null;
  specialties: string[];
  languages: string[];
  sessionsCompleted: number;
  avgRating: number;
  ratingCount: number;
  followerCount: number;
  badges: Badge[];
  posts?: Post[];
  user?: { id: string; displayName: string | null; avatarUrl: string | null };
};

export type Post = {
  id: string;
  astrologerId: string;
  type: 'text' | 'image' | 'video';
  body: string | null;
  mediaUrl: string | null;
  createdAt: string;
  astrologer?: AstrologerProfile;
};

export type FeedResponse = {
  posts: Post[];
  algorithmicContent: null;
};

export type Session = {
  id: string;
  type: 'private' | 'group' | 'kahve_fali_live';
  astrologerId: string;
  scheduledAt: string;
  durationMinutes: number;
  price: string;
  paymentModel: 'bundled' | 'a_la_carte';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
};

export type GroupSession = Session & {
  astrologer: { userId: string; bio: string | null; user: { displayName: string | null; avatarUrl: string | null } };
  _count: { participants: number };
};

export type KahveFaliOrder = {
  id: string;
  userId: string;
  astrologerId: string;
  photoUrl: string;
  status: 'pending' | 'delivered';
  interpretationText: string | null;
  orderedAt: string;
  deliveredAt: string | null;
  slaDeadline: string;
};

export type WalletAccount = {
  userId: string;
  balance: string;
};

export type WalletTransaction = {
  id: string;
  walletId: string;
  type: 'topup' | 'spend' | 'refund' | 'referral_bonus';
  amount: string;
  relatedSessionId: string | null;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  };
};
