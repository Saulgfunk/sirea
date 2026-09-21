import { Tabs } from 'expo-router';

import { color, type } from '../../theme/tokens';

// Text-only tab labels for now — the design system (docs/design-system/README.md)
// specifies inline stroke SVG icons with no icon font/emoji, but no icon set has
// been designed yet. Swap in real icons once one exists rather than reaching for
// an icon font as a placeholder.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: color.void },
        headerTintColor: color.ink,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: color.surface, borderTopColor: color.border },
        tabBarActiveTintColor: color.coral,
        tabBarInactiveTintColor: color.inkMuted,
        tabBarLabelStyle: type.caption,
        sceneStyle: { backgroundColor: color.void },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Sirea', tabBarLabel: 'Feed' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarLabel: 'Discover' }} />
      <Tabs.Screen name="falim" options={{ title: 'Falım', tabBarLabel: 'Falım' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet', tabBarLabel: 'Wallet' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: 'Profile' }} />
    </Tabs>
  );
}
