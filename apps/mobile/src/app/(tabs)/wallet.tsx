import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { wallet } from '../../data/mock';
import { color, radius, space, type } from '../../theme/tokens';

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet balance</Text>
        <Text style={styles.balanceValue}>${wallet.balance.toFixed(2)}</Text>
      </View>
      <FlatList
        data={wallet.transactions}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Transaction history</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowDate}>{item.date}</Text>
            </View>
            <Text style={[styles.rowAmount, item.amount < 0 && styles.rowAmountNegative]}>
              {item.amount > 0 ? '+' : ''}
              {item.amount.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.void },
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
