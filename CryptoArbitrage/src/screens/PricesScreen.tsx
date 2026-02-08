import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { CryptoAsset } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { formatTimeAgo } from '../utils/format';
import CryptoCard from '../components/CryptoCard';

interface Props {
  assets: CryptoAsset[];
  loading: boolean;
  refreshing: boolean;
  lastUpdated: number;
  onRefresh: () => void;
  onSelectAsset: (asset: CryptoAsset) => void;
}

export default function PricesScreen({
  assets,
  loading,
  refreshing,
  lastUpdated,
  onRefresh,
  onSelectAsset,
}: Props) {
  if (loading && assets.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching prices from exchanges...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CryptoCard asset={item} onPress={onSelectAsset} />
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
            <Text style={styles.title}>Crypto Prices</Text>
            <Text style={styles.subtitle}>
              {assets.length} assets across 5 exchanges
            </Text>
            {lastUpdated > 0 && (
              <Text style={styles.updated}>
                Updated {formatTimeAgo(lastUpdated)}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No price data available</Text>
            <Text style={styles.emptySubtext}>Pull to refresh</Text>
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
    padding: SPACING.xl,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
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
  listContent: {
    paddingBottom: 100,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
});
