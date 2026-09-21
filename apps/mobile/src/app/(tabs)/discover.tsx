import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sireaApi } from '../../api/sirea';
import { BadgePill } from '../../components/BadgePill';
import { useApi } from '../../hooks/useApi';
import { color, radius, space, type } from '../../theme/tokens';

// Search/filter by specialty, badge, rating, price (CD-3) is not wired up yet —
// this is a plain list, badge-holders are not specially re-sorted here either
// (CLAUDE.md: badge-holders get priority *placement*, never a separate hidden tier —
// the backend already orders by avgRating desc; worth revisiting deliberately
// once real filter UI exists).
export default function DiscoverScreen() {
  const { data, loading, error, refetch } = useApi(() => sireaApi.astrologers.list(), []);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={color.coral} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable onPress={refetch}>
            <Text style={styles.retry}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={data ?? []}
        keyExtractor={(a) => a.userId}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No astrologers yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={{ pathname: '/astrologer/[id]', params: { id: item.userId } }} asChild>
            <Pressable style={styles.card}>
              <View style={styles.avatar} />
              <View style={{ flex: 1, gap: space[1] }}>
                <Text style={styles.name}>{item.user?.displayName || 'Astrologer'}</Text>
                <Text style={styles.specialties} numberOfLines={1}>
                  {item.specialties.join(' · ') || 'No specialties listed'}
                </Text>
                <View style={styles.badgeRow}>
                  {item.badges.map((b) => (
                    <BadgePill key={b.id} badge={b.type} />
                  ))}
                </View>
                <Text style={styles.stats}>
                  ★ {item.avgRating.toFixed(1)} ({item.ratingCount}) · {item.sessionsCompleted} sessions
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space[6], gap: space[3] },
  emptyText: { ...type.bodyM, color: color.inkMuted, textAlign: 'center' },
  retry: { ...type.label, color: color.coral, textTransform: 'none' },
  list: { padding: space[5], gap: space[4], flexGrow: 1 },
  card: {
    flexDirection: 'row',
    gap: space[4],
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: space[4],
  },
  avatar: { width: 56, height: 56, borderRadius: radius.pill, backgroundColor: color.surface2 },
  name: { ...type.displayS, color: color.ink },
  specialties: { ...type.bodyS, color: color.inkMuted },
  badgeRow: { flexDirection: 'row', gap: space[1] },
  stats: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
});
