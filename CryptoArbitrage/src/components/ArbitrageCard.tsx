import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArbitrageOpportunity } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatPercent, getCryptoColor } from '../utils/format';

interface Props {
  opportunity: ArbitrageOpportunity;
  onPress: (opportunity: ArbitrageOpportunity) => void;
}

export default function ArbitrageCard({ opportunity, onPress }: Props) {
  const { asset, buyExchange, sellExchange, spreadPercent, estimatedProfit } =
    opportunity;
  const color = getCryptoColor(asset.symbol);

  const profitTier =
    spreadPercent >= 1 ? 'high' : spreadPercent >= 0.3 ? 'medium' : 'low';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(opportunity)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.icon, { backgroundColor: color + '20' }]}>
            <Text style={[styles.iconText, { color }]}>{asset.symbol[0]}</Text>
          </View>
          <View>
            <Text style={styles.symbol}>{asset.symbol}</Text>
            <Text style={styles.assetName}>{asset.name}</Text>
          </View>
        </View>
        <View
          style={[
            styles.profitBadge,
            {
              backgroundColor:
                profitTier === 'high'
                  ? COLORS.greenBg
                  : profitTier === 'medium'
                  ? COLORS.yellowBg
                  : COLORS.card,
            },
          ]}
        >
          <Text
            style={[
              styles.profitBadgeText,
              {
                color:
                  profitTier === 'high'
                    ? COLORS.green
                    : profitTier === 'medium'
                    ? COLORS.yellow
                    : COLORS.textSecondary,
              },
            ]}
          >
            {formatPercent(spreadPercent)}
          </Text>
        </View>
      </View>

      {/* Trade Flow */}
      <View style={styles.tradeFlow}>
        <View style={styles.exchangeBox}>
          <Text style={styles.actionLabel}>BUY</Text>
          <Text style={styles.exchangeName}>{buyExchange.exchangeName}</Text>
          <Text style={styles.exchangePrice}>
            {formatCurrency(buyExchange.ask)}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>{'-->'}</Text>
        </View>

        <View style={styles.exchangeBox}>
          <Text style={[styles.actionLabel, { color: COLORS.green }]}>SELL</Text>
          <Text style={styles.exchangeName}>{sellExchange.exchangeName}</Text>
          <Text style={styles.exchangePrice}>
            {formatCurrency(sellExchange.bid)}
          </Text>
        </View>
      </View>

      {/* Profit Line */}
      <View style={styles.profitRow}>
        <Text style={styles.profitLabel}>Est. profit on $1,000:</Text>
        <Text style={styles.profitAmount}>
          {formatCurrency(estimatedProfit)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.green + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  iconText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  symbol: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  assetName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  profitBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  profitBadgeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  tradeFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  exchangeBox: {
    flex: 1,
    alignItems: 'center',
  },
  actionLabel: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  exchangeName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  exchangePrice: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  arrowContainer: {
    paddingHorizontal: SPACING.sm,
  },
  arrow: {
    color: COLORS.green,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  profitAmount: {
    color: COLORS.green,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
