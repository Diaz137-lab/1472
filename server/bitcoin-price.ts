// Bitcoin price service using CoinGecko API
interface BitcoinPriceData {
  price: number;
  change24h: number;
  lastUpdated: number;
}

class BitcoinPriceService {
  private cache: BitcoinPriceData | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds

  async getBitcoinPrice(): Promise<BitcoinPriceData> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && now < this.cacheExpiry) {
      return this.cache;
    }

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.bitcoin) {
        throw new Error('Invalid response format from CoinGecko API');
      }

      const priceData: BitcoinPriceData = {
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change || 0,
        lastUpdated: data.bitcoin.last_updated_at || Math.floor(now / 1000)
      };

      // Update cache
      this.cache = priceData;
      this.cacheExpiry = now + this.CACHE_DURATION;
      
      return priceData;
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      
      // Return cached data if available, even if expired
      if (this.cache) {
        return this.cache;
      }
      
      // Fallback data if no cache available
      return {
        price: 50000, // Fallback price
        change24h: 0,
        lastUpdated: Math.floor(now / 1000)
      };
    }
  }

  convertUsdToBitcoin(usdAmount: number, btcPrice: number): number {
    return usdAmount / btcPrice;
  }

  formatBitcoinAmount(btcAmount: number): string {
    if (btcAmount >= 1) {
      return btcAmount.toFixed(6) + ' BTC';
    } else {
      // For smaller amounts, show in satoshis or mBTC
      const satoshis = btcAmount * 100000000;
      if (satoshis >= 1000) {
        return (btcAmount * 1000).toFixed(3) + ' mBTC';
      } else {
        return Math.round(satoshis).toLocaleString() + ' sats';
      }
    }
  }
}

export const bitcoinPriceService = new BitcoinPriceService();