import { useBitcoinConversion } from "@/hooks/use-bitcoin-price";

interface BitcoinDisplayProps {
  usdAmount: number;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function BitcoinDisplay({ 
  usdAmount, 
  className = "", 
  size = "sm", 
  showLabel = false 
}: BitcoinDisplayProps) {
  const { data: conversion, isLoading } = useBitcoinConversion(usdAmount);

  if (isLoading || !conversion) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`bg-gray-300 rounded ${getSizeClasses(size)}`}></div>
      </div>
    );
  }

  const sizeClass = getSizeClasses(size);
  const textColorClass = "text-orange-600 dark:text-orange-400";

  return (
    <p className={`${sizeClass} ${textColorClass} font-medium ${className}`}>
      {showLabel && "≈ "}{conversion.formattedBtc}
    </p>
  );
}

function getSizeClasses(size: string): string {
  switch (size) {
    case "xs":
      return "text-xs h-3 w-16";
    case "sm":
      return "text-sm h-4 w-20";
    case "md":
      return "text-base h-5 w-24";
    case "lg":
      return "text-lg h-6 w-32";
    default:
      return "text-sm h-4 w-20";
  }
}

export default BitcoinDisplay;