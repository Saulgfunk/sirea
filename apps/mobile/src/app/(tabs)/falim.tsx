import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, uploadFile } from '../../api/client';
import { sireaApi } from '../../api/sirea';
import { useAuth } from '../../auth/AuthContext';
import { Avatar } from '../../components/Avatar';
import { useApi } from '../../hooks/useApi';
import { color, radius, space, type } from '../../theme/tokens';

// KF-1/KF-2: photo upload + SLA. The reveal-screen ritual (KF-3, design system
// README) isn't built — this is a functional upload → order flow, not the
// considered reveal moment the product doc describes; worth a dedicated pass
// once there's a real interpretation pipeline to reveal.
export default function FalimScreen() {
  const { user } = useAuth();
  const { data: astrologers } = useApi(() => sireaApi.astrologers.list(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  async function pickPhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    const result = permission.granted
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, aspect: [1, 1], allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, aspect: [1, 1], allowsEditing: true });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function submit() {
    if (!user) {
      Alert.alert('Log in required', 'Log in from the Profile tab to order a kahve falı reading.');
      return;
    }
    if (!selectedId || !photoUri) return;
    setSubmitting(true);
    setOrderStatus(null);
    try {
      const uploaded = await uploadFile(photoUri, 'kahve-fali.jpg', 'image/jpeg');
      const order = await sireaApi.kahveFali.createOrder({ astrologerId: selectedId, photoUrl: uploaded.url });
      setOrderStatus(`Ordered — pending, SLA ${new Date(order.slaDeadline).toLocaleString()}`);
      setPhotoUri(null);
    } catch (err) {
      Alert.alert('Could not order', err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>1. Choose an astrologer</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.astrologerRow}>
          {(astrologers ?? []).map((a) => (
            <Pressable
              key={a.userId}
              style={[styles.astrologerChip, selectedId === a.userId && styles.astrologerChipSelected]}
              onPress={() => setSelectedId(a.userId)}
            >
              <Avatar uri={a.user?.avatarUrl} size={48} />
              <Text style={styles.astrologerName} numberOfLines={1}>
                {a.user?.displayName || 'Astrologer'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>2. Photograph your cup</Text>
        <Pressable style={styles.frame} onPress={pickPhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <Text style={styles.frameLabel}>Tap to take or choose a photo</Text>
          )}
        </Pressable>

        {orderStatus && <Text style={styles.status}>{orderStatus}</Text>}

        <Pressable
          style={[styles.cta, (!selectedId || !photoUri || submitting) && styles.ctaDisabled]}
          onPress={submit}
          disabled={!selectedId || !photoUri || submitting}
        >
          {submitting ? <ActivityIndicator color={color.void} /> : <Text style={styles.ctaLabel}>Order falı</Text>}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  content: { padding: space[5], gap: space[4] },
  label: { ...type.displayXs, color: color.ink },
  astrologerRow: { gap: space[3], paddingVertical: space[1] },
  astrologerChip: {
    alignItems: 'center',
    gap: space[1],
    width: 72,
    padding: space[2],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  astrologerChipSelected: { borderColor: color.coral, backgroundColor: color.surface },
  astrologerName: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  frame: {
    aspectRatio: 1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.border,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[6],
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  frameLabel: { ...type.bodyM, color: color.inkMuted, textAlign: 'center' },
  status: { ...type.bodyS, color: color.gold, textAlign: 'center' },
  cta: {
    backgroundColor: color.coral,
    borderRadius: radius.md,
    paddingVertical: space[4],
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.4 },
  ctaLabel: { ...type.label, color: color.void, textTransform: 'none', fontSize: 15 },
});
