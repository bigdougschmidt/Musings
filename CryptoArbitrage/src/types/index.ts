export type ExchangeId = 'binance' | 'coinbase' | 'kraken' | 'kucoin' | 'bybit';

export interface ExchangePrice {
  exchange: ExchangeId;
  exchangeName: string;
  bid: number;   // highest price a buyer is willing to pay (sell price)
  ask: number;   // lowest price a seller is willing to accept (buy price)
  lastPrice: number;
  volume24h: number;
  timestamp: number;
}

export interface CryptoAsset {
  id: string;          // e.g., 'BTC'
  name: string;        // e.g., 'Bitcoin'
  symbol: string;      // e.g., 'BTC'
  prices: ExchangePrice[];
  bestBid: ExchangePrice | null;   // best place to sell
  bestAsk: ExchangePrice | null;   // best place to buy
}

export interface ArbitrageOpportunity {
  id: string;
  asset: CryptoAsset;
  buyExchange: ExchangePrice;     // where to buy (lowest ask)
  sellExchange: ExchangePrice;    // where to sell (highest bid)
  spreadAmount: number;           // absolute profit per unit
  spreadPercent: number;          // percentage profit
  estimatedProfit: number;        // profit on a $1000 trade
  timestamp: number;
}

export type SortField = 'name' | 'price' | 'spread' | 'profit';
export type SortDirection = 'asc' | 'desc';

export interface AppSettings {
  refreshInterval: number;        // in seconds
  minimumSpreadPercent: number;    // filter threshold
  tradeAmount: number;            // for profit estimation
}
