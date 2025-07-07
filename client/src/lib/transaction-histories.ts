// Comprehensive transaction histories for multiple users with amounts and wallet addresses
export interface TransactionHistory {
  id: number;
  userId: number;
  username: string;
  type: "deposit" | "withdrawal" | "trade" | "p2p";
  status: "completed" | "failed" | "pending";
  currency: string;
  amount: number;
  amountUSD: number;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  paymentMethod?: string;
  timestamp: number;
  reason?: string; // for failed transactions
}

export const transactionHistories: TransactionHistory[] = [
  // Kelly Ann James - Active trader from Australia
  {
    id: 1,
    userId: 1,
    username: "Kelly Ann James",
    type: "deposit",
    status: "completed",
    currency: "BTC",
    amount: 0.5,
    amountUSD: 54750,
    toAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    txHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    paymentMethod: "Wire Transfer",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    id: 2,
    userId: 1,
    username: "Kelly Ann James", 
    type: "trade",
    status: "completed",
    currency: "ETH",
    amount: 8.75,
    amountUSD: 21875,
    fromAddress: "0x742f35cc6331c0532612345678901234567890ab",
    toAddress: "0x8ba1f109551bd432803012345678901234567890",
    txHash: "0x123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    paymentMethod: "Exchange",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    id: 3,
    userId: 1,
    username: "Kelly Ann James",
    type: "withdrawal",
    status: "failed",
    currency: "BTC",
    amount: 1.2,
    amountUSD: 131400,
    fromAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    toAddress: "bc1q9x8y7z6w5v4u3t2s1r0q9p8o7n6m5l4k3j2h1g0",
    paymentMethod: "Bank Transfer",
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
    reason: "Insufficient verification level for large withdrawal"
  },

  // Michael Chen - USA Trader
  {
    id: 4,
    userId: 2,
    username: "Michael Chen",
    type: "deposit",
    status: "completed",
    currency: "USDT",
    amount: 25000,
    amountUSD: 25000,
    toAddress: "0x123456789abcdef1234567890abcdef1234567890",
    txHash: "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef",
    paymentMethod: "ACH",
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
  },
  {
    id: 5,
    userId: 2,
    username: "Michael Chen",
    type: "p2p",
    status: "completed",
    currency: "BTC",
    amount: 0.25,
    amountUSD: 27375,
    fromAddress: "bc1q742f35cc6331c0532a28748b5ab4ccd681b257d",
    toAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    txHash: "def789abc123456def789abc123456def789abc123456def789abc123456def7",
    paymentMethod: "Credit Card",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    id: 6,
    userId: 2,
    username: "Michael Chen",
    type: "withdrawal",
    status: "pending",
    currency: "ETH",
    amount: 4.5,
    amountUSD: 11250,
    fromAddress: "0x8ba1f109551bd432803012345678901234567890",
    toAddress: "0x9cb2g210662ce543914123456789012345678901",
    paymentMethod: "Wire Transfer",
    timestamp: Date.now() - 86400000 * 0.5, // 12 hours ago
  },

  // Sarah Johnson - USA Merchant
  {
    id: 7,
    userId: 3,
    username: "Sarah Johnson",
    type: "deposit",
    status: "completed",
    currency: "SOL",
    amount: 150,
    amountUSD: 22800,
    toAddress: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    txHash: "3xKjHvYqZ4E8W9R2mF7dS1nP6tX9cV8bL5yU2qI3oG7zT4sA1hN6rE9wQ8pM5k",
    paymentMethod: "Debit Card",
    timestamp: Date.now() - 86400000 * 4, // 4 days ago
  },
  {
    id: 8,
    userId: 3,
    username: "Sarah Johnson",
    type: "trade",
    status: "failed",
    currency: "DOGE",
    amount: 50000,
    amountUSD: 8500,
    paymentMethod: "Exchange",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
    reason: "Market volatility caused trade timeout"
  },

  // James Smith - UK Trader
  {
    id: 9,
    userId: 4,
    username: "James Smith",
    type: "deposit",
    status: "completed",
    currency: "BTC",
    amount: 1.8,
    amountUSD: 197100,
    toAddress: "bc1q5j4h3g2f1e0d9c8b7a6z5y4x3w2v1u0t9s8r7q6",
    txHash: "890def123abc456789def123abc456789def123abc456789def123abc456789d",
    paymentMethod: "Bank Transfer",
    timestamp: Date.now() - 86400000 * 6, // 6 days ago
  },
  {
    id: 10,
    userId: 4,
    username: "James Smith",
    type: "p2p",
    status: "completed",
    currency: "ETH",
    amount: 12.4,
    amountUSD: 31000,
    fromAddress: "0x5j4h3g2f1e0d9c8b7a6z5y4x3w2v1u0t9s8r7q6p",
    toAddress: "0x742f35cc6331c0532612345678901234567890ab",
    txHash: "0x789def123abc456789def123abc456789def123abc456789def123abc456789de",
    paymentMethod: "Wise Transfer",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    id: 11,
    userId: 4,
    username: "James Smith",
    type: "withdrawal",
    status: "failed",
    currency: "BTC",
    amount: 0.75,
    amountUSD: 82125,
    fromAddress: "bc1q5j4h3g2f1e0d9c8b7a6z5y4x3w2v1u0t9s8r7q6",
    toAddress: "bc1q1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0",
    paymentMethod: "Bank Transfer",
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
    reason: "Daily withdrawal limit exceeded"
  },

  // Hiroshi Tanaka - Japan Trader
  {
    id: 12,
    userId: 5,
    username: "Hiroshi Tanaka",
    type: "deposit",
    status: "completed",
    currency: "BTC",
    amount: 2.3,
    amountUSD: 251370,
    toAddress: "bc1q1h2i3r4o5s6h7i8t9a0n1a2k3a4j5a6p7a8n9e0",
    txHash: "123abc456def789123abc456def789123abc456def789123abc456def789123a",
    paymentMethod: "Bank Transfer",
    timestamp: Date.now() - 86400000 * 7, // 7 days ago
  },
  {
    id: 13,
    userId: 5,
    username: "Hiroshi Tanaka",
    type: "trade",
    status: "completed",
    currency: "ETH",
    amount: 22.1,
    amountUSD: 55250,
    fromAddress: "0x1h2i3r4o5s6h7i8t9a0n1a2k3a4j5a6p7a8n9e0f",
    toAddress: "0x742f35cc6331c0532612345678901234567890ab",
    txHash: "0xabc456def789123abc456def789123abc456def789123abc456def789123abcd",
    paymentMethod: "Exchange",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
  },

  // Chukwu Okafor - Nigeria Trader
  {
    id: 14,
    userId: 6,
    username: "Chukwu Okafor",
    type: "deposit",
    status: "completed",
    currency: "BTC",
    amount: 1.6,
    amountUSD: 175200,
    toAddress: "bc1qc1h2u3k4w5u6o7k8a9f0o1r2n3i4g5e6r7i8a9",
    txHash: "456def789abc123456def789abc123456def789abc123456def789abc123456d",
    paymentMethod: "Flutterwave",
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
  },
  {
    id: 15,
    userId: 6,
    username: "Chukwu Okafor",
    type: "p2p",
    status: "failed",
    currency: "USDT",
    amount: 5000,
    amountUSD: 5000,
    paymentMethod: "Bank Transfer",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
    reason: "Payment method verification required"
  },

  // Joseph Kiprotich - Kenya Trader
  {
    id: 16,
    userId: 7,
    username: "Joseph Kiprotich",
    type: "deposit",
    status: "completed",
    currency: "BTC",
    amount: 0.9,
    amountUSD: 98550,
    toAddress: "bc1qj1o2s3e4p5h6k7i8p9r0o1t2i3c4h5k6e7n8y9a",
    txHash: "789abc123def456789abc123def456789abc123def456789abc123def456789a",
    paymentMethod: "M-Pesa",
    timestamp: Date.now() - 86400000 * 4, // 4 days ago
  },
  {
    id: 17,
    userId: 7,
    username: "Joseph Kiprotich",
    type: "withdrawal",
    status: "pending",
    currency: "BTC",
    amount: 0.3,
    amountUSD: 32850,
    fromAddress: "bc1qj1o2s3e4p5h6k7i8p9r0o1t2i3c4h5k6e7n8y9a",
    toAddress: "bc1q2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1",
    paymentMethod: "M-Pesa",
    timestamp: Date.now() - 86400000 * 0.25, // 6 hours ago
  },

  // Hans Mueller - Germany Trader
  {
    id: 18,
    userId: 8,
    username: "Hans Mueller",
    type: "deposit",
    status: "completed",
    currency: "SOL",
    amount: 89.4,
    amountUSD: 13500,
    toAddress: "2HaNsM93KjQvw7RzP1xG5F8Dt6CvS4YbN7Qe9Wm8Lk3H",
    txHash: "abc123def456789abc123def456789abc123def456789abc123def456789abc1",
    paymentMethod: "SEPA",
    timestamp: Date.now() - 86400000 * 8, // 8 days ago
  },
  {
    id: 19,
    userId: 8,
    username: "Hans Mueller",
    type: "trade",
    status: "failed",
    currency: "ETH",
    amount: 5.7,
    amountUSD: 14250,
    paymentMethod: "Exchange",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
    reason: "Network congestion caused transaction timeout"
  },

  // Additional transactions for other users
  {
    id: 20,
    userId: 9,
    username: "Carlos Silva",
    type: "deposit",
    status: "completed",
    currency: "USDT",
    amount: 75000,
    amountUSD: 75000,
    toAddress: "0xc1a2r3l4o5s6s7i8l9v0a1b2c3d4e5f6g7h8i9j0",
    txHash: "0xdef456789abc123def456789abc123def456789abc123def456789abc123def4",
    paymentMethod: "PIX",
    timestamp: Date.now() - 86400000 * 6, // 6 days ago
  },
  {
    id: 21,
    userId: 10,
    username: "Raj Patel",
    type: "deposit",
    status: "completed",
    currency: "LTC",
    amount: 78.5,
    amountUSD: 6967,
    toAddress: "ltc1qr1a2j3p4a5t6e7l8i9n0d1i2a3p4a5t6e7l8i9",
    txHash: "ghi789abc123def456ghi789abc123def456ghi789abc123def456ghi789abc1",
    paymentMethod: "UPI",
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
  },
  {
    id: 22,
    userId: 11,
    username: "Wei Lim",
    type: "withdrawal",
    status: "completed",
    currency: "ETH",
    amount: 8.3,
    amountUSD: 20750,
    fromAddress: "0xw1e2i3l4i5m6s7i8n9g0a1p2o3r4e5t6r7a8d9e0r",
    toAddress: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
    txHash: "0x456ghi789abc123def456ghi789abc123def456ghi789abc123def456ghi789a",
    paymentMethod: "Bank Transfer",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    id: 23,
    userId: 12,
    username: "Ahmed Al Rashid",
    type: "p2p",
    status: "failed",
    currency: "DOGE",
    amount: 25000,
    amountUSD: 4200,
    paymentMethod: "Wise Transfer",
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
    reason: "Cross-border transfer restrictions"
  }
];

// Helper function to get transaction histories for a specific user
export function getUserTransactionHistory(userId: number): TransactionHistory[] {
  return transactionHistories.filter(tx => tx.userId === userId);
}

// Helper function to get all transaction histories (for admin view)
export function getAllTransactionHistories(): TransactionHistory[] {
  return transactionHistories.sort((a, b) => b.timestamp - a.timestamp);
}

// Helper function to format currency amounts
export function formatCurrencyAmount(amount: number, currency: string): string {
  if (currency === "BTC") {
    return `${amount.toFixed(8)} BTC`;
  } else if (currency === "ETH") {
    return `${amount.toFixed(6)} ETH`;
  } else if (currency === "USDT") {
    return `${amount.toLocaleString()} USDT`;
  } else if (currency === "SOL") {
    return `${amount.toFixed(4)} SOL`;
  } else if (currency === "DOGE") {
    return `${amount.toLocaleString()} DOGE`;
  } else if (currency === "ADA") {
    return `${amount.toFixed(4)} ADA`;
  } else if (currency === "XRP") {
    return `${amount.toFixed(4)} XRP`;
  } else if (currency === "LTC") {
    return `${amount.toFixed(6)} LTC`;
  }
  return `${amount} ${currency}`;
}

// Helper function to get status badge color
export function getStatusColor(status: "completed" | "failed" | "pending"): string {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-400/30";
    case "failed":
      return "bg-red-500/20 text-red-400 border-red-400/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-400/30";
  }
}