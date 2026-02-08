import { ArbitrageOpportunity, CryptoAsset, ExchangePrice } from '../types';

const DEFAULT_TRADE_AMOUNT = 1000;

export function findBestPrices(prices: ExchangePrice[]): {
  bestBid: ExchangePrice | null;
  bestAsk: ExchangePrice | null;
} {
  if (prices.length === 0) return { bestBid: null, bestAsk: null };

  let bestBid = prices[0];
  let bestAsk = prices[0];

  for (const price of prices) {
    if (price.bid > bestBid.bid) bestBid = price;
    if (price.ask < bestAsk.ask) bestAsk = price;
  }

  return { bestBid, bestAsk };
}

export function calculateArbitrage(
  asset: CryptoAsset,
  tradeAmount: number = DEFAULT_TRADE_AMOUNT,
): ArbitrageOpportunity | null {
  const { bestBid, bestAsk } = asset;

  if (!bestBid || !bestAsk) return null;
  if (bestBid.exchange === bestAsk.exchange) return null;

  const spreadAmount = bestBid.bid - bestAsk.ask;
  if (spreadAmount <= 0) return null;

  const spreadPercent = (spreadAmount / bestAsk.ask) * 100;
  const units = tradeAmount / bestAsk.ask;
  const estimatedProfit = units * spreadAmount;

  return {
    id: `${asset.symbol}-${bestAsk.exchange}-${bestBid.exchange}`,
    asset,
    buyExchange: bestAsk,
    sellExchange: bestBid,
    spreadAmount,
    spreadPercent,
    estimatedProfit,
    timestamp: Date.now(),
  };
}

export function findAllArbitrageOpportunities(
  assets: CryptoAsset[],
  tradeAmount: number = DEFAULT_TRADE_AMOUNT,
  minimumSpreadPercent: number = 0,
): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];

  for (const asset of assets) {
    if (asset.prices.length < 2) continue;

    // Check all exchange pairs, not just best bid/ask
    for (let i = 0; i < asset.prices.length; i++) {
      for (let j = 0; j < asset.prices.length; j++) {
        if (i === j) continue;

        const buyFrom = asset.prices[i];  // buy at ask price
        const sellTo = asset.prices[j];   // sell at bid price

        const spreadAmount = sellTo.bid - buyFrom.ask;
        if (spreadAmount <= 0) continue;

        const spreadPercent = (spreadAmount / buyFrom.ask) * 100;
        if (spreadPercent < minimumSpreadPercent) continue;

        const units = tradeAmount / buyFrom.ask;
        const estimatedProfit = units * spreadAmount;

        opportunities.push({
          id: `${asset.symbol}-${buyFrom.exchange}-${sellTo.exchange}`,
          asset,
          buyExchange: buyFrom,
          sellExchange: sellTo,
          spreadAmount,
          spreadPercent,
          estimatedProfit,
          timestamp: Date.now(),
        });
      }
    }
  }

  return opportunities.sort((a, b) => b.spreadPercent - a.spreadPercent);
}
