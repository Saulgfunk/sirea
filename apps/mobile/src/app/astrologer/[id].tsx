import { useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BadgePill } from '../../components/BadgePill';
import { astrologers } from '../../data/mock';
import { color, radius, space, type } from '../../theme/tokens';

export default function AstrologerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const astrologer = astrologers.find((a) => a.id === id);

  if (!astrologer) {
    return (
      <View style={styles.screen}>
        <Text style={styles.name}>Astrologer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.avatar, { backgroundColor: astrologer.avatarColor }]} />
      <Text style={styles.name}>{astrologer.name}</Text>
      <View style={styles.badgeRow}>
        {astrologer.badges.length ? (
          astrologer.badges.map((b) => <BadgePill key={b} badge={b} />)
        ) : (
          <Text style={styles.noBadge}>No badges yet</Text>
        )}
      </View>
      <Text style={styles.bio}>{astrologer.bio}</Text>

      <View style={styles.statsRow}>
        <Stat label="Sessions" value={String(astrologer.stats.sessionsCompleted)} />
        <Stat label="Avg rating" value={astrologer.stats.avgRating.toFixed(1)} />
        <Stat label="Ratings" value={String(astrologer.stats.ratingCount)} />
        <Stat label="Followers" value={String(astrologer.stats.followerCount)} />
      </View>

      <Pressable
        style={styles.bookButton}
        onPress={() =>
          Alert.alert(
            'Booking not wired up yet',
            'Session booking, payment, and in-app video/voice depend on the backend and the still-open payment/market-scope questions in CLAUDE.md.'
          )
        }
      >
        <Text style={styles.bookButtonLabel}>
          {astrologer.priceFrom === 0 ? 'Book a free session' : `Book a session — from $${astrologer.priceFrom}`}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  content: { padding: space[5], alignItems: 'center', gap: space[3] },
  avatar: { width: 96, height: 96, borderRadius: radius.pill, marginBottom: space[2] },
  name: { ...type.displayM, color: color.ink },
  badgeRow: { flexDirection: 'row', gap: space[2] },
  noBadge: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  bio: { ...type.bodyM, color: color.inkSoft, textAlign: 'center', paddingHorizontal: space[4] },
  statsRow: {
    flexDirection: 'row',
    gap: space[6],
    marginTop: space[3],
    paddingVertical: space[4],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: color.border,
    width: '100%',
    justifyContent: 'center',
  },
  stat: { alignItems: 'center', gap: space[1] },
  statValue: { ...type.displayS, color: color.gold },
  statLabel: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  bookButton: {
    marginTop: space[5],
    backgroundColor: color.coral,
    borderRadius: radius.md,
    paddingVertical: space[4],
    paddingHorizontal: space[6],
    width: '100%',
    alignItems: 'center',
  },
  bookButtonLabel: { ...type.label, color: color.void, textTransform: 'none', fontSize: 15 },
});
