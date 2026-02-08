import { useState, useEffect, useCallback, useRef } from 'react';
import { CryptoAsset, ArbitrageOpportunity } from '../types';
import { fetchAllExchangePrices } from '../services/exchangeApi';
import { findBestPrices, findAllArbitrageOpportunities } from '../services/arbitrageEngine';
import { SUPPORTED_CRYPTOS } from '../constants/exchanges';

const REFRESH_INTERVAL_MS = 15000;
const TRADE_AMOUNT = 1000;

export function useCryptoData() {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);

    try {
      const assetPromises = SUPPORTED_CRYPTOS.map(async (crypto) => {
        const prices = await fetchAllExchangePrices(crypto.symbol);
        const { bestBid, bestAsk } = findBestPrices(prices);
        return {
          id: crypto.symbol,
          name: crypto.name,
          symbol: crypto.symbol,
          prices,
          bestBid,
          bestAsk,
        } as CryptoAsset;
      });

      const fetchedAssets = await Promise.all(assetPromises);
      const validAssets = fetchedAssets.filter((a) => a.prices.length > 0);

      setAssets(validAssets);

      const arbs = findAllArbitrageOpportunities(validAssets, TRADE_AMOUNT, 0);
      setOpportunities(arbs);
      setLastUpdated(Date.now());
    } catch (err) {
      setError('Failed to fetch price data. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(), REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return {
    assets,
    opportunities,
    loading,
    refreshing,
    lastUpdated,
    error,
    refresh,
  };
}
