import { ExchangeId, ExchangePrice } from '../types';
import EXCHANGES from '../constants/exchanges';

const KRAKEN_SYMBOL_MAP: Record<string, string> = {
  BTC: 'XBTUSD',
  ETH: 'ETHUSD',
  SOL: 'SOLUSD',
  XRP: 'XRPUSD',
  ADA: 'ADAUSD',
  DOGE: 'DOGEUSD',
  AVAX: 'AVAXUSD',
  DOT: 'DOTUSD',
  LINK: 'LINKUSD',
  MATIC: 'MATICUSD',
  UNI: 'UNIUSD',
  LTC: 'LTCUSD',
};

function getExchangeUrl(exchangeId: ExchangeId, symbol: string): string {
  switch (exchangeId) {
    case 'binance':
      return `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`;
    case 'coinbase':
      return `https://api.exchange.coinbase.com/products/${symbol}-USD/ticker`;
    case 'kraken': {
      const krakenSymbol = KRAKEN_SYMBOL_MAP[symbol] || `${symbol}USD`;
      return `https://api.kraken.com/0/public/Ticker?pair=${krakenSymbol}`;
    }
    case 'kucoin':
      return `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}-USDT`;
    case 'bybit':
      return `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`;
    default:
      return '';
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchExchangePrice(
  exchangeId: ExchangeId,
  symbol: string,
): Promise<ExchangePrice | null> {
  const exchange = EXCHANGES.find((e) => e.id === exchangeId);
  if (!exchange) return null;

  const url = getExchangeUrl(exchangeId, symbol);
  if (!url) return null;

  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;

    const data = await response.json();
    const parsed = exchange.parseResponse(data, symbol);
    if (!parsed || isNaN(parsed.bid) || isNaN(parsed.ask)) return null;

    return {
      exchange: exchangeId,
      exchangeName: exchange.name,
      bid: parsed.bid,
      ask: parsed.ask,
      lastPrice: parsed.last,
      volume24h: parsed.volume,
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function fetchAllExchangePrices(
  symbol: string,
): Promise<ExchangePrice[]> {
  const promises = EXCHANGES.map((exchange) =>
    fetchExchangePrice(exchange.id, symbol),
  );
  const results = await Promise.allSettled(promises);

  return results
    .filter(
      (r): r is PromiseFulfilledResult<ExchangePrice> =>
        r.status === 'fulfilled' && r.value !== null,
    )
    .map((r) => r.value);
}
