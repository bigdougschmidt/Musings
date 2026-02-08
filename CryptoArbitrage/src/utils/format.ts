export function formatCurrency(value: number, decimals?: number): string {
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (value >= 1) {
    return `$${value.toFixed(decimals ?? 2)}`;
  }
  if (value >= 0.01) {
    return `$${value.toFixed(decimals ?? 4)}`;
  }
  return `$${value.toFixed(decimals ?? 6)}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(3)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export function getCryptoIcon(symbol: string): string {
  const icons: Record<string, string> = {
    BTC: '\u20BF',
    ETH: '\u039E',
    SOL: 'S',
    XRP: 'X',
    ADA: 'A',
    DOGE: 'D',
    AVAX: 'A',
    DOT: 'D',
    LINK: 'L',
    MATIC: 'M',
    UNI: 'U',
    LTC: 'L',
  };
  return icons[symbol] || symbol[0];
}

export function getCryptoColor(symbol: string): string {
  const colors: Record<string, string> = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#9945FF',
    XRP: '#23292F',
    ADA: '#0033AD',
    DOGE: '#C2A633',
    AVAX: '#E84142',
    DOT: '#E6007A',
    LINK: '#2A5ADA',
    MATIC: '#8247E5',
    UNI: '#FF007A',
    LTC: '#BFBBBB',
  };
  return colors[symbol] || '#58A6FF';
}
