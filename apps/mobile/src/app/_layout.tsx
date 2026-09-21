import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { color } from '../theme/tokens';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.void },
          headerTintColor: color.ink,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.void },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="astrologer/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}
