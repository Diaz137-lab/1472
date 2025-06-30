export const mockChartData = [
  { time: "00:00", price: 108000 },
  { time: "04:00", price: 108200 },
  { time: "08:00", price: 107800 },
  { time: "12:00", price: 108500 },
  { time: "16:00", price: 108300 },
  { time: "20:00", price: 108524 },
];

export const mockPortfolioData = [
  { name: "Bitcoin", value: 45000, color: "#f7931a" },
  { name: "Ethereum", value: 25000, color: "#627eea" },
  { name: "Others", value: 15000, color: "#8884d8" },
];

export const mockTransactions = [
  {
    id: 1,
    type: "buy",
    asset: "BTC",
    amount: "0.05",
    price: "$5,426.24",
    date: "2024-01-15",
    status: "completed"
  },
  {
    id: 2,
    type: "sell",
    asset: "ETH",
    amount: "2.5",
    price: "$6,253.43",
    date: "2024-01-14",
    status: "completed"
  },
  {
    id: 3,
    type: "buy",
    asset: "SOL",
    amount: "10",
    price: "$1,523.10",
    date: "2024-01-13",
    status: "pending"
  }
];
