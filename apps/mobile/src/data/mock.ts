// Static placeholder data — stands in for the backend API (docs/08-Technical-Architecture.md §4)
// until that exists. Shapes mirror the entity list in CLAUDE.md / the architecture doc's data model.

export type Badge = 'verified_pro' | 'top_rated';

export type Astrologer = {
  id: string;
  name: string;
  specialties: string[];
  bio: string;
  avatarColor: string;
  badges: Badge[];
  stats: {
    sessionsCompleted: number;
    avgRating: number;
    ratingCount: number;
    followerCount: number;
  };
  priceFrom: number;
};

export type Post = {
  id: string;
  astrologerId: string;
  type: 'text' | 'image' | 'video';
  body: string;
  createdAt: string;
};

export const astrologers: Astrologer[] = [
  {
    id: 'a1',
    name: 'Leyla Aydın',
    specialties: ['Vedic astrology', 'Kahve falı'],
    bio: 'Third-generation falcı; 12 years reading natal charts and coffee cups alike.',
    avatarColor: '#8b7fd1',
    badges: ['verified_pro', 'top_rated'],
    stats: { sessionsCompleted: 412, avgRating: 4.9, ratingCount: 388, followerCount: 6200 },
    priceFrom: 25,
  },
  {
    id: 'a2',
    name: 'Marcus Webb',
    specialties: ['Relationship readings', 'Transits'],
    bio: 'Western astrologer focused on relationship compatibility and timing.',
    avatarColor: '#c9a961',
    badges: ['verified_pro'],
    stats: { sessionsCompleted: 198, avgRating: 4.7, ratingCount: 180, followerCount: 3100 },
    priceFrom: 40,
  },
  {
    id: 'a3',
    name: 'Priya Nair',
    specialties: ['Natal charts', 'Career timing'],
    bio: 'Building my practice here — free sessions this month while I get started.',
    avatarColor: '#e0785a',
    badges: [],
    stats: { sessionsCompleted: 34, avgRating: 4.8, ratingCount: 30, followerCount: 410 },
    priceFrom: 0,
  },
];

export const posts: Post[] = [
  {
    id: 'p1',
    astrologerId: 'a1',
    type: 'text',
    body: "Mercury retrograde starts Thursday — expect miscommunication in the houses it's transiting. Full breakdown in tonight's group session.",
    createdAt: '2h',
  },
  {
    id: 'p2',
    astrologerId: 'a2',
    type: 'text',
    body: 'A reminder: compatibility is about more than sun signs. Venus and Mars placements tell the real story.',
    createdAt: '5h',
  },
  {
    id: 'p3',
    astrologerId: 'a3',
    type: 'text',
    body: 'Two free kahve falı slots open this weekend for anyone who wants to try it out — first come, first served.',
    createdAt: '1d',
  },
];

export const wallet = {
  balance: 65,
  transactions: [
    { id: 't1', type: 'topup', amount: 50, label: 'Wallet top-up', date: 'Sep 18' },
    { id: 't2', type: 'spend', amount: -25, label: 'Session with Leyla Aydın', date: 'Sep 19' },
    { id: 't3', type: 'topup', amount: 40, label: 'Wallet top-up', date: 'Sep 20' },
  ],
};
