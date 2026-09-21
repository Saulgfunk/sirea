import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgePill } from '../../components/BadgePill';
import { astrologers } from '../../data/mock';
import { color, radius, space, type } from '../../theme/tokens';

// Search/filter by specialty, badge, rating, price (CD-3) is not wired up yet —
// this is a plain list, badge-holders are not specially re-sorted here either
// (CLAUDE.md: badge-holders get priority *placement*, never a separate hidden tier —
// worth implementing deliberately, not as a side effect of a naive sort).
export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={astrologers}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/astrologer/[id]', params: { id: item.id } }} asChild>
            <Pressable style={styles.card}>
              <View style={[styles.avatar, { backgroundColor: item.avatarColor }]} />
              <View style={{ flex: 1, gap: space[1] }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.specialties} numberOfLines={1}>
                  {item.specialties.join(' · ')}
                </Text>
                <View style={styles.badgeRow}>
                  {item.badges.map((b) => (
                    <BadgePill key={b} badge={b} />
                  ))}
                </View>
                <Text style={styles.stats}>
                  ★ {item.stats.avgRating} ({item.stats.ratingCount}) · {item.stats.sessionsCompleted} sessions ·{' '}
                  {item.priceFrom === 0 ? 'Free sessions' : `from $${item.priceFrom}`}
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  list: { padding: space[5], gap: space[4] },
  card: {
    flexDirection: 'row',
    gap: space[4],
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: space[4],
  },
  avatar: { width: 56, height: 56, borderRadius: radius.pill },
  name: { ...type.displayS, color: color.ink },
  specialties: { ...type.bodyS, color: color.inkMuted },
  badgeRow: { flexDirection: 'row', gap: space[1] },
  stats: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
});
