import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sireaApi } from '../../api/sirea';
import { Avatar } from '../../components/Avatar';
import { BadgePill } from '../../components/BadgePill';
import { useAuth } from '../../auth/AuthContext';
import { useApi } from '../../hooks/useApi';
import { color, radius, space, type } from '../../theme/tokens';

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// The stories row (mock data had one) is dropped for now — it'd need its own
// "followed astrologers" fetch and GET /feed doesn't return astrologer avatar
// data richly enough to make it worth a second request yet.
export default function FeedScreen() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error, refetch } = useApi(() => sireaApi.feed.get(), [user?.id]);

  if (authLoading) return null;

  if (!user) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Log in from the Profile tab to see your feed.</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        data={data?.posts ?? []}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              No posts yet — follow astrologers from Discover to see their content here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const astrologer = item.astrologer;
          return (
            <Link href={{ pathname: '/astrologer/[id]', params: { id: item.astrologerId } }} asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardHeader}>
                  <Avatar uri={astrologer?.user?.avatarUrl} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authorName}>{astrologer?.user?.displayName || 'Astrologer'}</Text>
                    <Text style={styles.timestamp}>{timeAgo(item.createdAt)}</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    {astrologer?.badges.map((b) => (
                      <BadgePill key={b.id} badge={b.type} />
                    ))}
                  </View>
                </View>
                {item.body && <Text style={styles.postBody}>{item.body}</Text>}
                {item.mediaUrl && <Image source={{ uri: item.mediaUrl }} style={styles.postImage} />}
              </Pressable>
            </Link>
          );
        }}
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
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: space[4],
    gap: space[3],
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  authorName: { ...type.displayS, color: color.ink },
  timestamp: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  badgeRow: { flexDirection: 'row', gap: space[1] },
  postBody: { ...type.bodyM, color: color.inkSoft },
  postImage: { width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: color.surface2 },
});
