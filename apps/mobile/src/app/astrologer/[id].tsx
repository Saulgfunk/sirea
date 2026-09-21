import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '../../api/client';
import { sireaApi } from '../../api/sirea';
import { useAuth } from '../../auth/AuthContext';
import { BadgePill } from '../../components/BadgePill';
import { useApi } from '../../hooks/useApi';
import { color, radius, space, type } from '../../theme/tokens';

export default function AstrologerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: astrologer, loading, error } = useApi(() => sireaApi.astrologers.get(id), [id]);
  const { data: slots } = useApi(() => sireaApi.astrologers.availability(id), [id]);
  const [following, setFollowing] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  async function follow() {
    if (!user) {
      Alert.alert('Log in required', 'Log in from the Profile tab to follow astrologers.');
      return;
    }
    setFollowing(true);
    try {
      await sireaApi.astrologers.follow(id);
      Alert.alert('Following', "You'll see their posts in your feed.");
    } catch (err) {
      Alert.alert('Could not follow', err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setFollowing(false);
    }
  }

  async function joinSlot(slotId: string) {
    if (!user) {
      Alert.alert('Log in required', 'Log in from the Profile tab to book a session.');
      return;
    }
    setJoining(slotId);
    try {
      await sireaApi.sessions.join(slotId);
      Alert.alert('Booked', 'Your session is confirmed — check back once video/voice is available.');
    } catch (err) {
      Alert.alert('Could not book', err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setJoining(null);
    }
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={color.coral} />
      </View>
    );
  }

  if (error || !astrologer) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.name}>{error ?? 'Astrologer not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.avatar} />
      <Text style={styles.name}>{astrologer.user?.displayName || 'Astrologer'}</Text>
      <View style={styles.badgeRow}>
        {astrologer.badges.length ? (
          astrologer.badges.map((b) => <BadgePill key={b.id} badge={b.type} />)
        ) : (
          <Text style={styles.noBadge}>No badges yet</Text>
        )}
      </View>
      {astrologer.bio && <Text style={styles.bio}>{astrologer.bio}</Text>}

      <View style={styles.statsRow}>
        <Stat label="Sessions" value={String(astrologer.sessionsCompleted)} />
        <Stat label="Avg rating" value={astrologer.avgRating.toFixed(1)} />
        <Stat label="Ratings" value={String(astrologer.ratingCount)} />
        <Stat label="Followers" value={String(astrologer.followerCount)} />
      </View>

      <Pressable style={styles.followButton} onPress={follow} disabled={following}>
        <Text style={styles.followButtonLabel}>{following ? 'Following…' : 'Follow'}</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Open session slots</Text>
      {!slots?.length && <Text style={styles.noSlots}>No open slots right now.</Text>}
      {slots?.map((slot) => (
        <Pressable
          key={slot.id}
          style={styles.slotCard}
          onPress={() => joinSlot(slot.id)}
          disabled={joining === slot.id}
        >
          <View>
            <Text style={styles.slotTime}>{new Date(slot.scheduledAt).toLocaleString()}</Text>
            <Text style={styles.slotMeta}>
              {slot.durationMinutes} min · {slot.paymentModel === 'a_la_carte' ? `$${slot.price}` : 'Subscription'}
            </Text>
          </View>
          {joining === slot.id ? <ActivityIndicator color={color.coral} /> : <Text style={styles.bookLabel}>Book</Text>}
        </Pressable>
      ))}

      <Pressable style={styles.backLink} onPress={() => router.back()}>
        <Text style={styles.backLinkLabel}>Back</Text>
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
  centered: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: space[5], alignItems: 'center', gap: space[3] },
  avatar: { width: 96, height: 96, borderRadius: radius.pill, backgroundColor: color.surface2, marginBottom: space[2] },
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
  followButton: {
    backgroundColor: color.surface2,
    borderRadius: radius.md,
    paddingVertical: space[3],
    paddingHorizontal: space[6],
    alignItems: 'center',
  },
  followButtonLabel: { ...type.label, color: color.ink, textTransform: 'none', fontSize: 14 },
  sectionTitle: { ...type.displayXs, color: color.ink, alignSelf: 'flex-start', marginTop: space[5] },
  noSlots: { ...type.bodyS, color: color.inkMuted },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    padding: space[4],
  },
  slotTime: { ...type.bodyM, color: color.ink },
  slotMeta: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  bookLabel: { ...type.label, color: color.coral, textTransform: 'none', fontSize: 14 },
  backLink: { marginTop: space[5] },
  backLinkLabel: { ...type.bodyS, color: color.inkMuted },
});
