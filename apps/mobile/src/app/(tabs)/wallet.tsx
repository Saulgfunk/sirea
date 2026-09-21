import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sireaApi } from '../../api/sirea';
import { useAuth } from '../../auth/AuthContext';
import { useApi } from '../../hooks/useApi';
import { color, radius, space, type } from '../../theme/tokens';

export default function WalletScreen() {
  const { user, loading: authLoading } = useAuth();
  const { data: wallet, loading: walletLoading } = useApi(() => sireaApi.wallet.get(), [user?.id]);
  const { data: transactions, loading: txLoading } = useApi(() => sireaApi.wallet.transactions(), [user?.id]);

  if (authLoading) return null;

  if (!user) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Log in from the Profile tab to see your wallet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (walletLoading || txLoading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={color.coral} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet balance</Text>
        <Text style={styles.balanceValue}>${Number(wallet?.balance ?? 0).toFixed(2)}</Text>
        <Text style={styles.topupNote}>
          Top-up isn't live yet — it needs a real payment processor (see CLAUDE.md).
        </Text>
      </View>
      <FlatList
        data={transactions ?? []}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Transaction history</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
        renderItem={({ item }) => {
          const amount = Number(item.amount);
          return (
            <View style={styles.row}>
              <View>
                <Text style={styles.rowLabel}>{transactionLabel(item.type)}</Text>
                <Text style={styles.rowDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.rowAmount, amount < 0 && styles.rowAmountNegative]}>
                {amount > 0 ? '+' : ''}
                {amount.toFixed(2)}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function transactionLabel(type: string): string {
  switch (type) {
    case 'topup':
      return 'Wallet top-up';
    case 'spend':
      return 'Session payment';
    case 'refund':
      return 'Refund';
    case 'referral_bonus':
      return 'Referral bonus';
    default:
      return type;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space[6] },
  emptyText: { ...type.bodyM, color: color.inkMuted, textAlign: 'center' },
  balanceCard: {
    margin: space[5],
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
    gap: space[1],
  },
  balanceLabel: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  balanceValue: { ...type.displayL, color: color.gold },
  topupNote: { ...type.caption, color: color.inkMuted, textTransform: 'none', marginTop: space[2] },
  list: { paddingHorizontal: space[5], paddingBottom: space[5], gap: space[3] },
  sectionTitle: { ...type.displayXs, color: color.ink, marginBottom: space[2] },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space[3],
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  rowLabel: { ...type.bodyM, color: color.inkSoft },
  rowDate: { ...type.caption, color: color.inkMuted, textTransform: 'none' },
  rowAmount: { ...type.displayXs, color: color.ink },
  rowAmountNegative: { color: color.inkMuted },
});
