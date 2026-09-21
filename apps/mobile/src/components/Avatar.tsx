import { Image, StyleSheet, View } from 'react-native';

import { color, radius } from '../theme/tokens';

export function Avatar({ uri, size = 40 }: { uri?: string | null; size?: number }) {
  const style = { width: size, height: size, borderRadius: radius.pill };
  if (uri) {
    return <Image source={{ uri }} style={[styles.image, style]} />;
  }
  return <View style={[styles.placeholder, style]} />;
}

const styles = StyleSheet.create({
  image: { backgroundColor: color.surface2 },
  placeholder: { backgroundColor: color.surface2 },
});
