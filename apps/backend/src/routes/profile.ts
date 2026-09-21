import { Router } from 'express';
import { z } from 'zod';

import { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const profileRouter = Router();
profileRouter.use(requireAuth);

function sunSignFrom(birthDate: Date): string {
  // Placeholder sign lookup by month/day — the real natal-chart computation
  // (docs/08-Technical-Architecture.md §2: Swiss Ephemeris) isn't wired up.
  const m = birthDate.getUTCMonth() + 1;
  const d = birthDate.getUTCDate();
  const signs: [string, number, number][] = [
    ['capricorn', 1, 19], ['aquarius', 2, 18], ['pisces', 3, 20], ['aries', 4, 19],
    ['taurus', 5, 20], ['gemini', 6, 20], ['cancer', 7, 22], ['leo', 8, 22],
    ['virgo', 9, 22], ['libra', 10, 22], ['scorpio', 11, 21], ['sagittarius', 12, 21],
  ];
  const entry = signs.find(([, month, cutoff]) => m === month && d <= cutoff);
  return entry?.[0] ?? signs[(m % 12)]![0];
}

profileRouter.get('/', async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { userId: req.auth!.sub } });
  res.json(profile ?? null);
});

const patchSchema = z.object({
  birthPlace: z.string().optional(),
});

profileRouter.patch('/', async (req, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const profile = await prisma.profile.upsert({
    where: { userId: req.auth!.sub },
    create: { userId: req.auth!.sub, ...parsed.data },
    update: parsed.data,
  });
  res.json(profile);
});

// ON-2/ON-3: birth date required, birth time/place optional (skippable) —
// sun-sign content unlocks on birth date alone; full natal chart needs the rest.
const birthDataSchema = z.object({
  birthDate: z.coerce.date(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
});

profileRouter.post('/birth-data', async (req, res) => {
  const parsed = birthDataSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { birthDate, birthTime, birthPlace } = parsed.data;
  const sunSign = sunSignFrom(birthDate);

  // Full natal chart data only once birth time + place are both present —
  // computation itself is not implemented (see sunSignFrom comment above).
  // Prisma.JsonNull, not JS `null`, is how you explicitly write a JSON null
  // (bare `null` means "leave the field unset" on a Json? column).
  const natalChartData = birthTime && birthPlace ? Prisma.JsonNull : undefined;

  const profile = await prisma.profile.upsert({
    where: { userId: req.auth!.sub },
    create: { userId: req.auth!.sub, birthDate, birthTime, birthPlace, sunSign, natalChartData },
    update: { birthDate, birthTime, birthPlace, sunSign, natalChartData },
  });
  res.json(profile);
});
