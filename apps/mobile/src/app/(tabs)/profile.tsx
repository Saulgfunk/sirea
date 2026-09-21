import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, space, type } from '../../theme/tokens';

// No auth/signup flow yet (ON-1) — this stands in for "my profile" once one exists.
export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign-up not built yet</Text>
        <Text style={styles.body}>
          This screen will hold birth date/time/place entry, sun-sign content, and account settings once
          onboarding (ON-1–ON-3) exists.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  content: { flex: 1, padding: space[5], justifyContent: 'center', gap: space[3] },
  title: { ...type.displayM, color: color.ink, textAlign: 'center' },
  body: { ...type.bodyM, color: color.inkMuted, textAlign: 'center' },
});
