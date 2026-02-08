import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CryptoAsset } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, getCryptoColor } from '../utils/format';

interface Props {
  asset: CryptoAsset;
  onPress: (asset: CryptoAsset) => void;
}

export default function CryptoCard({ asset, onPress }: Props) {
  const avgPrice =
    asset.prices.length > 0
      ? asset.prices.reduce((sum, p) => sum + p.lastPrice, 0) / asset.prices.length
      : 0;

  const spread =
    asset.bestBid && asset.bestAsk
      ? ((asset.bestBid.bid - asset.bestAsk.ask) / asset.bestAsk.ask) * 100
      : 0;

  const hasOpportunity = spread > 0;
  const color = getCryptoColor(asset.symbol);

  return (
    <TouchableOpacity
      style={[styles.card, hasOpportunity && styles.cardHighlight]}
      onPress={() => onPress(asset)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={[styles.iconText, { color }]}>{asset.symbol[0]}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.symbol}>{asset.symbol}</Text>
          <Text style={styles.name}>{asset.name}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>{formatCurrency(avgPrice)}</Text>
        <View style={styles.spreadRow}>
          {asset.prices.length >= 2 ? (
            <View
              style={[
                styles.spreadBadge,
                {
                  backgroundColor: hasOpportunity ? COLORS.greenBg : COLORS.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.spreadText,
                  {
                    color: hasOpportunity ? COLORS.green : COLORS.textSecondary,
                  },
                ]}
              >
                {hasOpportunity ? `+${spread.toFixed(3)}%` : 'No arb'}
              </Text>
            </View>
          ) : (
            <Text style={styles.exchangeCount}>
              {asset.prices.length} exchange{asset.prices.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHighlight: {
    borderColor: COLORS.green + '40',
    backgroundColor: COLORS.card,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  nameContainer: {
    marginLeft: SPACING.md,
  },
  symbol: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  name: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  spreadRow: {
    marginTop: 4,
  },
  spreadBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  spreadText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  exchangeCount: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
});
