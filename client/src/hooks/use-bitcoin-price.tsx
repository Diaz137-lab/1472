import { useQuery } from '@tanstack/react-query';

interface BitcoinPriceData {
  price: number;
  change24h: number;
  lastUpdated: number;
}

interface BitcoinConversion {
  usdAmount: number;
  btcPrice: number;
  btcAmount: number;
  formattedBtc: string;
  change24h: number;
  lastUpdated: number;
}

export function useBitcoinPrice() {
  return useQuery<BitcoinPriceData>({
    queryKey: ['/api/bitcoin/price'],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
}

export function useBitcoinConversion(usdAmount: number) {
  return useQuery<BitcoinConversion>({
    queryKey: ['/api/bitcoin/convert', usdAmount],
    enabled: usdAmount > 0,
    refetchInterval: 30000,
    staleTime: 25000,
  });
}