import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, radius, space, type } from '../../theme/tokens';

// Kahve falı: upload → SLA-bound interpretation → reveal (KF-1–KF-4). The reveal
// screen is meant to feel like a ritual moment (docs/design-system/README.md), not
// a flat notification — worth designing deliberately once there's a real upload/
// interpretation pipeline behind it, rather than placeholder-izing that moment here.
export default function FalimScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.frame}>
          <Text style={styles.frameLabel}>Upload a photo of your coffee cup</Text>
        </View>
        <Text style={styles.helper}>
          Choose an astrologer, upload your cup, and get an interpretation within their stated turnaround time.
        </Text>
        <Pressable style={styles.cta} disabled>
          <Text style={styles.ctaLabel}>Upload photo (coming soon)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  content: { flex: 1, padding: space[5], justifyContent: 'center', gap: space[5] },
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
  },
  frameLabel: { ...type.bodyM, color: color.inkMuted, textAlign: 'center' },
  helper: { ...type.bodyS, color: color.inkMuted, textAlign: 'center' },
  cta: {
    backgroundColor: color.surface2,
    borderRadius: radius.md,
    paddingVertical: space[4],
    alignItems: 'center',
    opacity: 0.6,
  },
  ctaLabel: { ...type.label, color: color.inkMuted, textTransform: 'none', fontSize: 15 },
});
