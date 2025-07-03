import React, { useState, useEffect } from 'react';
import { Bitcoin, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/use-bitcoin-price';
import { Badge } from '@/components/ui/badge';

interface BitcoinPriceDisplayProps {
  className?: string;
  showDetails?: boolean;
  animated?: boolean;
}

export function BitcoinPriceDisplay({ 
  className = "", 
  showDetails = true, 
  animated = true 
}: BitcoinPriceDisplayProps) {
  const { data: bitcoinData, isLoading, error } = useBitcoinPrice();
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);

  useEffect(() => {
    if (bitcoinData?.price) {
      setDisplayPrice(bitcoinData.price);
    }
  }, [bitcoinData]);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-bitcoin-orange border-t-transparent"></div>
        <div className="text-gray-500">Loading Bitcoin price...</div>
      </div>
    );
  }

  if (error || !bitcoinData) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Bitcoin className="w-8 h-8 text-bitcoin-orange/50" />
        <div className="text-gray-500">Bitcoin price unavailable</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const isPositiveChange = bitcoinData.change24h > 0;

  return (
    <div className={`
      flex items-center space-x-4 
      ${animated ? 'price-ticker' : ''}
      ${className}
    `}>
      <div className={`
        p-3 rounded-xl 
        ${animated ? 'bitcoin-glow' : ''}
        bg-bitcoin-gradient
      `}>
        <Bitcoin className={`w-8 h-8 text-white ${animated ? 'bitcoin-float' : ''}`} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatPrice(displayPrice || bitcoinData.price)}
          </h3>
          
          <div className={`
            flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold
            ${isPositiveChange 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
            }
          `}>
            {isPositiveChange ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(bitcoinData.change24h).toFixed(2)}%</span>
          </div>
        </div>
        
        {showDetails && (
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>Bitcoin (BTC)</span>
            <Badge variant="outline" className="border-bitcoin-orange/30 text-bitcoin-orange">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <span className="text-xs">
              Updated: {new Date(bitcoinData.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BitcoinPriceDisplay;