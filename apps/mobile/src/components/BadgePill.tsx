import { StyleSheet, Text, View } from 'react-native';

import type { BadgeType } from '../api/types';
import { color, radius, space, type } from '../theme/tokens';

// Verified Pro = gold (trust/credibility), Top Rated = purple (algorithmic/mystical layer).
// Never swap or blend these — CLAUDE.md § Key architectural constraints.
const LABEL: Record<BadgeType, string> = {
  verified_pro: 'Verified Pro',
  top_rated: 'Top Rated',
};

const TINT: Record<BadgeType, string> = {
  verified_pro: color.gold,
  top_rated: color.purple,
};

export function BadgePill({ badge }: { badge: BadgeType }) {
  const tint = TINT[badge];
  return (
    <View style={[styles.pill, { borderColor: tint }]}>
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <Text style={[styles.label, { color: tint }]}>{LABEL[badge]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingVertical: space[1],
    paddingHorizontal: space[2],
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...type.caption,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
