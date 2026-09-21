import { Link } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '../../api/client';
import { sireaApi } from '../../api/sirea';
import { useAuth } from '../../auth/AuthContext';
import { Avatar } from '../../components/Avatar';
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
        ListHeaderComponent={<GroupSessionsRow />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No astrologers yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={{ pathname: '/astrologer/[id]', params: { id: item.userId } }} asChild>
            <Pressable style={styles.card}>
              <Avatar uri={item.user?.avatarUrl} size={56} />
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

// GS-1: upcoming live group sessions. Premium-gating (GS-2/GS-3) is modeled
// backend-side as price > 0 — see apps/backend's groupSessions.ts comment.
function GroupSessionsRow() {
  const { user } = useAuth();
  const { data: sessions, refetch } = useApi(
    () => (user ? sireaApi.groupSessions.list() : Promise.resolve([])),
    [user?.id]
  );

  if (!user || !sessions?.length) return null;

  async function join(id: string) {
    try {
      await sireaApi.groupSessions.join(id);
      Alert.alert('Joined', "You're registered — check back once video/voice is available.");
      refetch();
    } catch (err) {
      Alert.alert('Could not join', err instanceof ApiError ? err.message : 'Something went wrong');
    }
  }

  return (
    <View style={styles.groupSection}>
      <Text style={styles.groupSectionTitle}>Live & upcoming group sessions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupRow}>
        {sessions.map((s) => (
          <Pressable key={s.id} style={styles.groupCard} onPress={() => join(s.id)}>
            <Avatar uri={s.astrologer.user.avatarUrl} size={40} />
            <Text style={styles.groupHost} numberOfLines={1}>
              {s.astrologer.user.displayName || 'Astrologer'}
            </Text>
            <Text style={styles.groupTime}>{new Date(s.scheduledAt).toLocaleString()}</Text>
            <Text style={styles.groupMeta}>
              {Number(s.price) > 0 ? 'Premium' : 'Free'} · {s._count.participants} joined
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
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
  name: { ...type.displayS, color: color.ink },
  specialties: { ...type.bodyS, color: color.inkMuted },
  badgeRow: { flexDirection: 'row', gap: space[1] },
  stats: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  groupSection: { marginBottom: space[4] },
  groupSectionTitle: { ...type.displayXs, color: color.ink, marginBottom: space[3] },
  groupRow: { gap: space[3] },
  groupCard: {
    width: 160,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.purple,
    padding: space[3],
    gap: space[1],
  },
  groupHost: { ...type.bodyS, color: color.ink, marginTop: space[1] },
  groupTime: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  groupMeta: { ...type.caption, color: color.purple, textTransform: 'none' },
});
