import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CryptoAsset, ExchangePrice } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import {
  formatCurrency,
  formatVolume,
  getCryptoColor,
  formatPercent,
} from '../utils/format';
import EXCHANGES from '../constants/exchanges';

interface Props {
  asset: CryptoAsset;
  onBack: () => void;
}

function ExchangeRow({
  price,
  isBestBid,
  isBestAsk,
}: {
  price: ExchangePrice;
  isBestBid: boolean;
  isBestAsk: boolean;
}) {
  const exchange = EXCHANGES.find((e) => e.id === price.exchange);
  const color = exchange?.color || COLORS.primary;

  return (
    <View style={styles.exchangeRow}>
      <View style={styles.exchangeLeft}>
        <View style={[styles.exchangeDot, { backgroundColor: color }]} />
        <Text style={styles.exchangeName}>{price.exchangeName}</Text>
      </View>
      <View style={styles.exchangeRight}>
        <View style={styles.priceCell}>
          <Text style={styles.priceLabel}>Bid</Text>
          <Text
            style={[
              styles.priceValue,
              isBestBid && { color: COLORS.green, fontWeight: '700' },
            ]}
          >
            {formatCurrency(price.bid)}
          </Text>
          {isBestBid && (
            <Text style={styles.bestTag}>BEST</Text>
          )}
        </View>
        <View style={styles.priceCell}>
          <Text style={styles.priceLabel}>Ask</Text>
          <Text
            style={[
              styles.priceValue,
              isBestAsk && { color: COLORS.green, fontWeight: '700' },
            ]}
          >
            {formatCurrency(price.ask)}
          </Text>
          {isBestAsk && (
            <Text style={styles.bestTag}>BEST</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function DetailScreen({ asset, onBack }: Props) {
  const color = getCryptoColor(asset.symbol);
  const sortedPrices = [...asset.prices].sort((a, b) => a.ask - b.ask);

  const spread =
    asset.bestBid && asset.bestAsk
      ? ((asset.bestBid.bid - asset.bestAsk.ask) / asset.bestAsk.ask) * 100
      : 0;

  const avgPrice =
    asset.prices.length > 0
      ? asset.prices.reduce((sum, p) => sum + p.lastPrice, 0) /
        asset.prices.length
      : 0;

  const highestPrice = Math.max(...asset.prices.map((p) => p.lastPrice));
  const lowestPrice = Math.min(...asset.prices.map((p) => p.lastPrice));
  const priceRange = highestPrice - lowestPrice;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: color + '20' }]}>
          <Text style={[styles.heroIconText, { color }]}>
            {asset.symbol[0]}
          </Text>
        </View>
        <Text style={styles.heroSymbol}>{asset.symbol}</Text>
        <Text style={styles.heroName}>{asset.name}</Text>
        <Text style={styles.heroPrice}>{formatCurrency(avgPrice)}</Text>
        <Text style={styles.heroSubtitle}>Average across exchanges</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{asset.prices.length}</Text>
          <Text style={styles.statLabel}>Exchanges</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statValue,
              { color: spread > 0 ? COLORS.green : COLORS.textSecondary },
            ]}
          >
            {formatPercent(spread)}
          </Text>
          <Text style={styles.statLabel}>Best Spread</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatCurrency(priceRange)}</Text>
          <Text style={styles.statLabel}>Price Range</Text>
        </View>
      </View>

      {/* Arbitrage Opportunity */}
      {spread > 0 && asset.bestBid && asset.bestAsk && (
        <View style={styles.arbCard}>
          <Text style={styles.sectionTitle}>Arbitrage Opportunity</Text>
          <View style={styles.arbFlow}>
            <View style={styles.arbStep}>
              <Text style={styles.arbAction}>BUY on</Text>
              <Text style={styles.arbExchange}>
                {asset.bestAsk.exchangeName}
              </Text>
              <Text style={styles.arbPrice}>
                @ {formatCurrency(asset.bestAsk.ask)}
              </Text>
            </View>
            <Text style={styles.arbArrow}>{'-->'}</Text>
            <View style={styles.arbStep}>
              <Text style={[styles.arbAction, { color: COLORS.green }]}>
                SELL on
              </Text>
              <Text style={styles.arbExchange}>
                {asset.bestBid.exchangeName}
              </Text>
              <Text style={styles.arbPrice}>
                @ {formatCurrency(asset.bestBid.bid)}
              </Text>
            </View>
          </View>
          <View style={styles.arbProfitRow}>
            <Text style={styles.arbProfitLabel}>
              Estimated profit per $1,000:
            </Text>
            <Text style={styles.arbProfitValue}>
              {formatCurrency(
                (1000 / asset.bestAsk.ask) *
                  (asset.bestBid.bid - asset.bestAsk.ask),
              )}
            </Text>
          </View>
        </View>
      )}

      {/* Exchange Prices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exchange Prices</Text>
        <View style={styles.exchangeList}>
          {sortedPrices.map((price) => (
            <ExchangeRow
              key={price.exchange}
              price={price}
              isBestBid={
                asset.bestBid?.exchange === price.exchange
              }
              isBestAsk={
                asset.bestAsk?.exchange === price.exchange
              }
            />
          ))}
        </View>
      </View>

      {/* Volume */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>24h Volume by Exchange</Text>
        {sortedPrices.map((price) => {
          const exchange = EXCHANGES.find((e) => e.id === price.exchange);
          const maxVol = Math.max(...asset.prices.map((p) => p.volume24h));
          const barWidth = maxVol > 0 ? (price.volume24h / maxVol) * 100 : 0;
          return (
            <View key={price.exchange} style={styles.volumeRow}>
              <Text style={styles.volumeExchange}>
                {price.exchangeName}
              </Text>
              <View style={styles.volumeBarContainer}>
                <View
                  style={[
                    styles.volumeBar,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: exchange?.color || COLORS.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.volumeValue}>
                {formatVolume(price.volume24h)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 120,
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroIconText: {
    fontSize: 36,
    fontWeight: '800',
  },
  heroSymbol: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  heroName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 4,
  },
  heroPrice: {
    color: COLORS.text,
    fontSize: FONT_SIZE.hero,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  arbCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.green + '40',
  },
  arbFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  arbStep: {
    flex: 1,
    alignItems: 'center',
  },
  arbAction: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  arbExchange: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginTop: 4,
  },
  arbPrice: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  arbArrow: {
    color: COLORS.green,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginHorizontal: SPACING.sm,
  },
  arbProfitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  arbProfitLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  arbProfitValue: {
    color: COLORS.green,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  exchangeList: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exchangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exchangeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exchangeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  exchangeName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  exchangeRight: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  priceCell: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginBottom: 2,
  },
  priceValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  bestTag: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  volumeExchange: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    width: 80,
  },
  volumeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: 4,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  volumeBar: {
    height: 8,
    borderRadius: 4,
  },
  volumeValue: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    width: 60,
    textAlign: 'right',
  },
});
