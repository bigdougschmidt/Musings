import { ExchangeId } from '../types';

export interface ExchangeConfig {
  id: ExchangeId;
  name: string;
  color: string;
  tickerUrl: string;
  parseResponse: (data: any, symbol: string) => { bid: number; ask: number; last: number; volume: number } | null;
}

const EXCHANGES: ExchangeConfig[] = [
  {
    id: 'binance',
    name: 'Binance',
    color: '#F0B90B',
    tickerUrl: 'https://api.binance.com/api/v3/ticker/24hr',
    parseResponse: (data: any, symbol: string) => {
      const pair = `${symbol}USDT`;
      const ticker = Array.isArray(data)
        ? data.find((t: any) => t.symbol === pair)
        : data.symbol === pair ? data : null;
      if (!ticker) return null;
      return {
        bid: parseFloat(ticker.bidPrice),
        ask: parseFloat(ticker.askPrice),
        last: parseFloat(ticker.lastPrice),
        volume: parseFloat(ticker.quoteVolume),
      };
    },
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    color: '#0052FF',
    tickerUrl: 'https://api.exchange.coinbase.com/products',
    parseResponse: (data: any, symbol: string) => {
      if (!data || !data.ticker) return null;
      return {
        bid: parseFloat(data.ticker.bid),
        ask: parseFloat(data.ticker.ask),
        last: parseFloat(data.ticker.price),
        volume: parseFloat(data.ticker.volume) * parseFloat(data.ticker.price),
      };
    },
  },
  {
    id: 'kraken',
    name: 'Kraken',
    color: '#5741D9',
    tickerUrl: 'https://api.kraken.com/0/public/Ticker',
    parseResponse: (data: any, symbol: string) => {
      if (!data || !data.result) return null;
      const keys = Object.keys(data.result);
      if (keys.length === 0) return null;
      const ticker = data.result[keys[0]];
      return {
        bid: parseFloat(ticker.b[0]),
        ask: parseFloat(ticker.a[0]),
        last: parseFloat(ticker.c[0]),
        volume: parseFloat(ticker.v[1]) * parseFloat(ticker.c[0]),
      };
    },
  },
  {
    id: 'kucoin',
    name: 'KuCoin',
    color: '#24AE8F',
    tickerUrl: 'https://api.kucoin.com/api/v1/market/orderbook/level1',
    parseResponse: (data: any, symbol: string) => {
      if (!data || !data.data) return null;
      const ticker = data.data;
      return {
        bid: parseFloat(ticker.bestBid),
        ask: parseFloat(ticker.bestAsk),
        last: parseFloat(ticker.price),
        volume: parseFloat(ticker.size || '0'),
      };
    },
  },
  {
    id: 'bybit',
    name: 'Bybit',
    color: '#F7A600',
    tickerUrl: 'https://api.bybit.com/v5/market/tickers',
    parseResponse: (data: any, symbol: string) => {
      if (!data?.result?.list?.[0]) return null;
      const ticker = data.result.list[0];
      return {
        bid: parseFloat(ticker.bid1Price),
        ask: parseFloat(ticker.ask1Price),
        last: parseFloat(ticker.lastPrice),
        volume: parseFloat(ticker.turnover24h),
      };
    },
  },
];

export default EXCHANGES;

export const SUPPORTED_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'XRP' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'LTC', name: 'Litecoin' },
];
