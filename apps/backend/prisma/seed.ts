// Demo/dev seed data — realistic-looking astrologers, posts, and a couple of
// bookable sessions, so the app doesn't look empty on first run. Avatars are
// via pravatar.cc (real anonymized face photos, free to hotlink, no attribution
// needed) — not licensed stock photography, but functions the same for demo
// purposes. Not meant to run against a production database.
import 'dotenv/config';

import { hashPassword } from '../src/lib/password.js';
import { prisma } from '../src/lib/prisma.js';

const DEMO_PASSWORD = 'password123';

type SeedAstrologer = {
  email: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  specialties: string[];
  languages: string[];
  badge?: 'verified_pro' | 'top_rated';
  posts: { type: 'text' | 'image'; body: string; mediaUrl?: string }[];
  sessionPrice: number;
};

const astrologers: SeedAstrologer[] = [
  {
    email: 'leyla@sirea.demo',
    displayName: 'Leyla Aydın',
    avatarUrl: 'https://i.pravatar.cc/300?img=47',
    bio: 'Third-generation falcı and Vedic astrologer — 12 years reading natal charts and coffee cups alike. Based between Istanbul and London.',
    specialties: ['Vedic astrology', 'Kahve falı', 'Relationship readings'],
    languages: ['en', 'tr'],
    badge: 'verified_pro',
    sessionPrice: 45,
    posts: [
      {
        type: 'text',
        body: "Mercury retrograde starts Thursday and it's moving through your communication house — expect crossed wires, resent texts, and at least one email you wish you hadn't sent. Breathe before you reply to anything that stings.",
      },
      {
        type: 'text',
        body: "Kahve falı isn't fortune-telling in the Hollywood sense — it's pattern reading. The shapes in your cup are a mirror, not a prophecy. What you see in them tells me as much about you as it does about what's ahead.",
      },
      {
        type: 'image',
        mediaUrl: 'https://picsum.photos/seed/kahvefali1/800/800',
        body: "Tonight's group session cup — a bird mid-flight near the rim. New opportunity landing soon for whoever this reading is for.",
      },
      {
        type: 'text',
        body: 'Venus enters Scorpio this weekend. If you\'ve been holding back from a conversation about where a relationship is headed, the next ten days are unusually good timing for it.',
      },
    ],
  },
  {
    email: 'marcus@sirea.demo',
    displayName: 'Marcus Webb',
    avatarUrl: 'https://i.pravatar.cc/300?img=12',
    bio: 'Western astrologer focused on relationship compatibility and life timing. 8 years in practice, formerly wrote the horoscope column for a London lifestyle magazine.',
    specialties: ['Relationship readings', 'Transits', 'Career timing'],
    languages: ['en'],
    badge: 'verified_pro',
    sessionPrice: 60,
    posts: [
      {
        type: 'text',
        body: "A reminder: compatibility is about more than sun signs. Venus and Mars placements tell the real story — I've seen 'incompatible' sun-sign pairs with rock-solid Venus synastry outlast plenty of 'perfect matches.'",
      },
      {
        type: 'text',
        body: "Saturn's current transit is a slow, unglamorous one — it rewards whoever keeps showing up, not whoever makes the loudest move. If the last few months have felt like grinding with no payoff, that's the point, not a sign you're off track.",
      },
      {
        type: 'text',
        body: "Booked out through next week for 1:1s, but I've opened two spots in Thursday's group session on reading your own transit chart — useful if you've ever wanted to stop needing someone else to interpret it for you.",
      },
    ],
  },
  {
    email: 'priya@sirea.demo',
    displayName: 'Priya Nair',
    avatarUrl: 'https://i.pravatar.cc/300?img=32',
    bio: "Building my practice here — offering discounted sessions this month while I grow my track record. Trained under a family friend who's read charts in Kerala for 30 years.",
    specialties: ['Natal charts', 'Career timing'],
    languages: ['en'],
    sessionPrice: 20,
    posts: [
      {
        type: 'text',
        body: "Two discounted natal chart readings left this week — if you've never had your birth chart read properly (not the app-generated kind), this is a good low-cost way to try it.",
      },
      {
        type: 'text',
        body: 'Your 10th house (career, reputation) is where I always look first when someone asks "should I take the job." The sign on the cusp says more about *how* you should approach a career move than any single transit does.',
      },
    ],
  },
  {
    email: 'amara@sirea.demo',
    displayName: 'Amara Okafor',
    avatarUrl: 'https://i.pravatar.cc/300?img=25',
    bio: 'Astrologer and tarot reader, 15+ years. Recognized name in the community — happy to be here early and help build what this platform becomes.',
    specialties: ['Tarot-informed readings', 'Full natal chart', 'Group sessions'],
    languages: ['en'],
    badge: 'top_rated',
    sessionPrice: 55,
    posts: [
      {
        type: 'text',
        body: "People ask if astrology and tarot 'agree' with each other. Wrong question — they're different tools for different questions. Astrology tells you the weather. Tarot tells you what to do about it.",
      },
      {
        type: 'text',
        body: "This week's full moon in Pisces is going to bring something to the surface that you've been avoiding looking at directly. Not a bad thing — just don't be surprised if it's louder than usual.",
      },
      {
        type: 'text',
        body: "300 sessions in on this platform and still get nervous before a reading for someone I don't know yet. That's a good sign, honestly — means I still care about getting it right.",
      },
    ],
  },
  {
    email: 'deniz@sirea.demo',
    displayName: 'Deniz Kaya',
    avatarUrl: 'https://i.pravatar.cc/300?img=68',
    bio: 'Kahve falı specialist — grew up watching my grandmother read for the whole apartment building over Sunday coffee. Now doing it here.',
    specialties: ['Kahve falı'],
    languages: ['en', 'tr'],
    sessionPrice: 15,
    posts: [
      {
        type: 'image',
        mediaUrl: 'https://picsum.photos/seed/kahvefali2/800/800',
        body: 'A ladder shape near the handle — someone\'s about to get the promotion they\'ve been quietly working toward.',
      },
      {
        type: 'text',
        body: "Kahve falı 101: don't drink it too fast, don't stir the grounds, and let the cup sit inverted for a few minutes before it's read. The rush is the whole point — good things are worth waiting a few minutes for.",
      },
    ],
  },
];

async function main() {
  console.log('Seeding demo data...');
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  for (const a of astrologers) {
    const existing = await prisma.user.findUnique({ where: { email: a.email } });
    if (existing) {
      console.log(`Skipping ${a.displayName} — already seeded.`);
      continue;
    }

    const user = await prisma.user.create({
      data: { email: a.email, passwordHash, displayName: a.displayName, avatarUrl: a.avatarUrl },
    });
    await prisma.walletAccount.create({ data: { userId: user.id } });
    await prisma.subscription.create({ data: { userId: user.id } });

    await prisma.astrologerProfile.create({
      data: {
        userId: user.id,
        bio: a.bio,
        specialties: a.specialties,
        languages: a.languages,
      },
    });

    if (a.badge) {
      await prisma.badge.create({
        data: { astrologerId: user.id, type: a.badge, grantedVia: 'platform_direct' },
      });
    }

    for (const p of a.posts) {
      await prisma.post.create({
        data: { astrologerId: user.id, type: p.type, body: p.body, mediaUrl: p.mediaUrl },
      });
    }

    // A couple of open, bookable private-session slots per astrologer.
    const now = Date.now();
    await prisma.session.createMany({
      data: [
        {
          type: 'private',
          astrologerId: user.id,
          scheduledAt: new Date(now + 2 * 24 * 60 * 60 * 1000),
          durationMinutes: 30,
          price: a.sessionPrice.toFixed(2),
          paymentModel: 'a_la_carte',
        },
        {
          type: 'private',
          astrologerId: user.id,
          scheduledAt: new Date(now + 4 * 24 * 60 * 60 * 1000),
          durationMinutes: 45,
          price: (a.sessionPrice * 1.4).toFixed(2),
          paymentModel: 'a_la_carte',
        },
      ],
    });

    console.log(`Seeded ${a.displayName} (${a.email})`);
  }

  console.log(`\nDone. Demo accounts all use password: ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
