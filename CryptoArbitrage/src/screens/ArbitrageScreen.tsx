import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { ArbitrageOpportunity, CryptoAsset } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatTimeAgo, formatCurrency } from '../utils/format';
import ArbitrageCard from '../components/ArbitrageCard';

interface Props {
  opportunities: ArbitrageOpportunity[];
  loading: boolean;
  refreshing: boolean;
  lastUpdated: number;
  onRefresh: () => void;
  onSelectAsset: (asset: CryptoAsset) => void;
}

export default function ArbitrageScreen({
  opportunities,
  loading,
  refreshing,
  lastUpdated,
  onRefresh,
  onSelectAsset,
}: Props) {
  const totalPotentialProfit = opportunities.reduce(
    (sum, o) => sum + o.estimatedProfit,
    0,
  );

  if (loading && opportunities.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Scanning for arbitrage...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={opportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArbitrageCard
            opportunity={item}
            onPress={(o) => onSelectAsset(o.asset)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Arbitrage</Text>
            <Text style={styles.subtitle}>
              Cross-exchange opportunities
            </Text>
            {lastUpdated > 0 && (
              <Text style={styles.updated}>
                Updated {formatTimeAgo(lastUpdated)}
              </Text>
            )}

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {opportunities.length}
                  </Text>
                  <Text style={styles.summaryLabel}>Opportunities</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: COLORS.green }]}>
                    {formatCurrency(totalPotentialProfit)}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Est. Profit</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {opportunities.length > 0
                      ? `${opportunities[0].spreadPercent.toFixed(2)}%`
                      : '--'}
                  </Text>
                  <Text style={styles.summaryLabel}>Best Spread</Text>
                </View>
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                Spreads are indicative. Actual profits depend on fees, slippage,
                and transfer times between exchanges.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Opportunities</Text>
            <Text style={styles.emptyText}>
              No profitable arbitrage opportunities found right now. Prices are
              closely aligned across exchanges.
            </Text>
            <Text style={styles.emptySubtext}>
              Pull to refresh or wait for auto-update every 15s.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
  updated: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  disclaimer: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  disclaimerText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
  },
});
