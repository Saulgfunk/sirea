import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '../../api/client';
import { sireaApi } from '../../api/sirea';
import { useAuth } from '../../auth/AuthContext';
import { color, radius, space, type } from '../../theme/tokens';

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <ActivityIndicator color={color.coral} />
        </View>
      </SafeAreaView>
    );
  }

  return user ? <AccountScreen /> : <AuthForm />;
}

function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password, displayName);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.form}>
        <Text style={styles.title}>{mode === 'login' ? 'Log in' : 'Sign up'}</Text>
        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={color.inkMuted}
            value={displayName}
            onChangeText={setDisplayName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={color.inkMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={color.inkMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={styles.submitButton} onPress={submit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={color.void} />
          ) : (
            <Text style={styles.submitLabel}>{mode === 'login' ? 'Log in' : 'Sign up'}</Text>
          )}
        </Pressable>
        <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          <Text style={styles.switchModeLabel}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function AccountScreen() {
  const { user, logout } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveBirthDate() {
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      // ON-3: birth time/place stay optional — only date is collected here.
      await sireaApi.profile.setBirthData({ birthDate: new Date(birthDate).toISOString() });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save birth date');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.form}>
        <Text style={styles.title}>{user?.displayName || user?.email || user?.phone}</Text>

        <Text style={styles.label}>Birth date (unlocks sun-sign content)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={color.inkMuted}
          value={birthDate}
          onChangeText={setBirthDate}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {saved && <Text style={styles.saved}>Saved.</Text>}
        <Pressable style={styles.submitButton} onPress={saveBirthDate} disabled={saving || !birthDate}>
          {saving ? <ActivityIndicator color={color.void} /> : <Text style={styles.submitLabel}>Save</Text>}
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutLabel}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  form: { flex: 1, padding: space[5], justifyContent: 'center', gap: space[3] },
  title: { ...type.displayM, color: color.ink, textAlign: 'center', marginBottom: space[3] },
  label: { ...type.bodyS, color: color.inkMuted },
  input: {
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    color: color.ink,
    ...type.bodyM,
  },
  error: { ...type.bodyS, color: color.coral },
  saved: { ...type.bodyS, color: color.gold },
  submitButton: {
    backgroundColor: color.coral,
    borderRadius: radius.md,
    paddingVertical: space[4],
    alignItems: 'center',
    marginTop: space[2],
  },
  submitLabel: { ...type.label, color: color.void, textTransform: 'none', fontSize: 15 },
  switchModeLabel: { ...type.bodyS, color: color.inkMuted, textAlign: 'center', marginTop: space[3] },
  logoutButton: { alignItems: 'center', marginTop: space[6] },
  logoutLabel: { ...type.bodyS, color: color.inkMuted },
});
