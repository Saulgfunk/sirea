import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgePill } from '../../components/BadgePill';
import { astrologers, posts } from '../../data/mock';
import { color, radius, space, type } from '../../theme/tokens';

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<StoriesRow />}
        renderItem={({ item }) => {
          const astrologer = astrologers.find((a) => a.id === item.astrologerId)!;
          return (
            <Link href={{ pathname: '/astrologer/[id]', params: { id: astrologer.id } }} asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.avatar, { backgroundColor: astrologer.avatarColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authorName}>{astrologer.name}</Text>
                    <Text style={styles.timestamp}>{item.createdAt} ago</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    {astrologer.badges.map((b) => (
                      <BadgePill key={b} badge={b} />
                    ))}
                  </View>
                </View>
                <Text style={styles.postBody}>{item.body}</Text>
              </Pressable>
            </Link>
          );
        }}
      />
    </SafeAreaView>
  );
}

function StoriesRow() {
  return (
    <FlatList
      horizontal
      data={astrologers}
      keyExtractor={(a) => a.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.stories}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/astrologer/[id]', params: { id: item.id } }} asChild>
          <Pressable style={styles.storyItem}>
            <View style={[styles.storyAvatar, { backgroundColor: item.avatarColor }]} />
            <Text style={styles.storyName} numberOfLines={1}>
              {item.name.split(' ')[0]}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  list: { padding: space[5], gap: space[4] },
  stories: { gap: space[4], paddingBottom: space[5] },
  storyItem: { alignItems: 'center', width: 64, gap: space[1] },
  storyAvatar: { width: 56, height: 56, borderRadius: radius.pill, borderWidth: 2, borderColor: color.coral },
  storyName: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: space[4],
    gap: space[3],
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
  authorName: { ...type.displayS, color: color.ink },
  timestamp: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  badgeRow: { flexDirection: 'row', gap: space[1] },
  postBody: { ...type.bodyM, color: color.inkSoft },
});
