import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '../../api/client';
import { sireaApi } from '../../api/sirea';
import type { AstrologerProfile } from '../../api/types';
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
      <View style={styles.centeredForm}>
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

  // Tri-state rather than useApi: a 404 here means "hasn't become an
  // astrologer yet", a legitimate state, not an error to surface.
  const [astrologer, setAstrologer] = useState<AstrologerProfile | 'none' | 'loading'>('loading');

  async function loadAstrologerProfile() {
    if (!user) return;
    try {
      setAstrologer(await sireaApi.astrologers.get(user.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setAstrologer('none');
      else setAstrologer('none'); // fail open to the "become an astrologer" CTA rather than a dead screen
    }
  }

  useEffect(() => {
    loadAstrologerProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
      <ScrollView contentContainerStyle={styles.scrollForm}>
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

        <View style={styles.divider} />

        {astrologer === 'loading' && <ActivityIndicator color={color.coral} />}
        {astrologer === 'none' && <BecomeAstrologerForm onDone={loadAstrologerProfile} />}
        {astrologer !== 'loading' && astrologer !== 'none' && (
          <AstrologerPanel astrologer={astrologer} onPosted={loadAstrologerProfile} />
        )}

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutLabel}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function BecomeAstrologerForm({ onDone }: { onDone: () => void }) {
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      await sireaApi.astrologers.create({
        bio: bio || undefined,
        specialties: specialties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        languages: [],
      });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Become an astrologer</Text>
      <Text style={styles.sectionHint}>
        No approval needed to start — Verified Pro/Top Rated badges are what carry trust later.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Bio"
        placeholderTextColor={color.inkMuted}
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Specialties, comma separated"
        placeholderTextColor={color.inkMuted}
        value={specialties}
        onChangeText={setSpecialties}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.submitButton} onPress={submit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={color.void} /> : <Text style={styles.submitLabel}>Create profile</Text>}
      </Pressable>
    </View>
  );
}

function AstrologerPanel({ astrologer, onPosted }: { astrologer: AstrologerProfile; onPosted: () => void }) {
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post() {
    setError(null);
    setPosting(true);
    try {
      await sireaApi.astrologers.createPost(astrologer.userId, { type: 'text', body });
      setBody('');
      onPosted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setPosting(false);
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your astrologer profile</Text>
      <Text style={styles.sectionHint}>
        {astrologer.followerCount} followers · {astrologer.sessionsCompleted} sessions · ★{' '}
        {astrologer.avgRating.toFixed(1)} ({astrologer.ratingCount})
      </Text>

      <Text style={[styles.label, { marginTop: space[3] }]}>New post</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor={color.inkMuted}
        value={body}
        onChangeText={setBody}
        multiline
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.submitButton} onPress={post} disabled={posting || !body}>
        {posting ? <ActivityIndicator color={color.void} /> : <Text style={styles.submitLabel}>Post</Text>}
      </Pressable>

      {!!astrologer.posts?.length && (
        <View style={{ gap: space[2], marginTop: space[4] }}>
          {astrologer.posts.map((p) => (
            <View key={p.id} style={styles.postPreview}>
              <Text style={styles.postPreviewText}>{p.body}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centeredForm: { flex: 1, padding: space[5], justifyContent: 'center', gap: space[3] },
  scrollForm: { padding: space[5], gap: space[3] },
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
  divider: { height: 1, backgroundColor: color.border, marginVertical: space[5] },
  section: { gap: space[3] },
  sectionTitle: { ...type.displayXs, color: color.ink },
  sectionHint: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  postPreview: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    padding: space[3],
  },
  postPreviewText: { ...type.bodyS, color: color.inkSoft },
});
