import { 
  users, portfolios, holdings, transactions, cryptoAssets,
  type User, type InsertUser, type Portfolio, type InsertPortfolio,
  type Holding, type InsertHolding, type Transaction, type InsertTransaction,
  type CryptoAsset, type InsertCryptoAsset
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Portfolio methods
  getPortfolio(userId: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(userId: number, updates: Partial<Portfolio>): Promise<Portfolio | undefined>;
  
  // Holdings methods
  getHoldings(portfolioId: number): Promise<Holding[]>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(id: number, updates: Partial<Holding>): Promise<Holding | undefined>;
  deleteHolding(id: number): Promise<boolean>;
  
  // Transaction methods
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Crypto asset methods
  getCryptoAssets(): Promise<CryptoAsset[]>;
  getCryptoAsset(symbol: string): Promise<CryptoAsset | undefined>;
  createOrUpdateCryptoAsset(asset: InsertCryptoAsset): Promise<CryptoAsset>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  private holdings: Map<number, Holding>;
  private transactions: Map<number, Transaction>;
  private cryptoAssets: Map<string, CryptoAsset>;
  private currentUserId: number;
  private currentPortfolioId: number;
  private currentHoldingId: number;
  private currentTransactionId: number;
  private currentAssetId: number;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.holdings = new Map();
    this.transactions = new Map();
    this.cryptoAssets = new Map();
    this.currentUserId = 1;
    this.currentPortfolioId = 1;
    this.currentHoldingId = 1;
    this.currentTransactionId = 1;
    this.currentAssetId = 1;
    
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize popular crypto assets
    const mockAssets = [
      { symbol: "BTC", name: "Bitcoin", currentPrice: "108524.84", priceChange24h: "1.19", marketCap: "2145000000000", volume24h: "45000000000" },
      { symbol: "ETH", name: "Ethereum", currentPrice: "2501.37", priceChange24h: "2.98", marketCap: "301000000000", volume24h: "15000000000" },
      { symbol: "DOGE", name: "Dogecoin", currentPrice: "0.17", priceChange24h: "3.01", marketCap: "25000000000", volume24h: "2000000000" },
      { symbol: "SOL", name: "Solana", currentPrice: "152.31", priceChange24h: "1.77", marketCap: "72000000000", volume24h: "3500000000" },
      { symbol: "ADA", name: "Cardano", currentPrice: "0.45", priceChange24h: "-1.25", marketCap: "16000000000", volume24h: "800000000" },
      { symbol: "DOT", name: "Polkadot", currentPrice: "6.85", priceChange24h: "0.95", marketCap: "9500000000", volume24h: "450000000" }
    ];

    mockAssets.forEach(asset => {
      const cryptoAsset: CryptoAsset = {
        id: this.currentAssetId++,
        symbol: asset.symbol,
        name: asset.name,
        currentPrice: asset.currentPrice,
        priceChange24h: asset.priceChange24h,
        marketCap: asset.marketCap,
        volume24h: asset.volume24h,
        updatedAt: new Date()
      };
      this.cryptoAssets.set(asset.symbol, cryptoAsset);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      isVerified: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getPortfolio(userId: number): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(portfolio => portfolio.userId === userId);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.currentPortfolioId++;
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      updatedAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(userId: number, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = await this.getPortfolio(userId);
    if (portfolio) {
      const updatedPortfolio = { ...portfolio, ...updates, updatedAt: new Date() };
      this.portfolios.set(portfolio.id, updatedPortfolio);
      return updatedPortfolio;
    }
    return undefined;
  }

  async getHoldings(portfolioId: number): Promise<Holding[]> {
    return Array.from(this.holdings.values()).filter(holding => holding.portfolioId === portfolioId);
  }

  async createHolding(insertHolding: InsertHolding): Promise<Holding> {
    const id = this.currentHoldingId++;
    const holding: Holding = {
      ...insertHolding,
      id,
      updatedAt: new Date()
    };
    this.holdings.set(id, holding);
    return holding;
  }

  async updateHolding(id: number, updates: Partial<Holding>): Promise<Holding | undefined> {
    const holding = this.holdings.get(id);
    if (holding) {
      const updatedHolding = { ...holding, ...updates, updatedAt: new Date() };
      this.holdings.set(id, updatedHolding);
      return updatedHolding;
    }
    return undefined;
  }

  async deleteHolding(id: number): Promise<boolean> {
    return this.holdings.delete(id);
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      const updatedTransaction = { ...transaction, ...updates };
      this.transactions.set(id, updatedTransaction);
      return updatedTransaction;
    }
    return undefined;
  }

  async getCryptoAssets(): Promise<CryptoAsset[]> {
    return Array.from(this.cryptoAssets.values());
  }

  async getCryptoAsset(symbol: string): Promise<CryptoAsset | undefined> {
    return this.cryptoAssets.get(symbol);
  }

  async createOrUpdateCryptoAsset(insertAsset: InsertCryptoAsset): Promise<CryptoAsset> {
    const existing = this.cryptoAssets.get(insertAsset.symbol);
    if (existing) {
      const updated = { ...existing, ...insertAsset, updatedAt: new Date() };
      this.cryptoAssets.set(insertAsset.symbol, updated);
      return updated;
    } else {
      const id = this.currentAssetId++;
      const asset: CryptoAsset = {
        ...insertAsset,
        id,
        updatedAt: new Date()
      };
      this.cryptoAssets.set(insertAsset.symbol, asset);
      return asset;
    }
  }
}

export const storage = new MemStorage();
