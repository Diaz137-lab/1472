import { 
  users, portfolios, holdings, transactions, cryptoAssets, adminBalanceActions,
  type User, type InsertUser, type Portfolio, type InsertPortfolio,
  type Holding, type InsertHolding, type Transaction, type InsertTransaction,
  type CryptoAsset, type InsertCryptoAsset, type AdminBalanceAction, type InsertAdminBalanceAction
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
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
  
  // Admin methods
  getAdminBalanceActions(): Promise<AdminBalanceAction[]>;
  createAdminBalanceAction(action: InsertAdminBalanceAction): Promise<AdminBalanceAction>;
  getUserBalanceActions(userId: number): Promise<AdminBalanceAction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  private holdings: Map<number, Holding>;
  private transactions: Map<number, Transaction>;
  private cryptoAssets: Map<string, CryptoAsset>;
  private adminBalanceActions: Map<number, AdminBalanceAction>;
  private currentUserId: number;
  private currentPortfolioId: number;
  private currentHoldingId: number;
  private currentTransactionId: number;
  private currentAssetId: number;
  private currentAdminActionId: number;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.holdings = new Map();
    this.transactions = new Map();
    this.cryptoAssets = new Map();
    this.adminBalanceActions = new Map();
    this.currentUserId = 1;
    this.currentPortfolioId = 1;
    this.currentHoldingId = 1;
    this.currentTransactionId = 1;
    this.currentAssetId = 1;
    this.currentAdminActionId = 1;
    
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

    // Create mock users for admin testing
    const mockUsers = [
      { username: "johndoe", email: "john@example.com", password: "hashed_password", firstName: "John", lastName: "Doe" },
      { username: "janesmith", email: "jane@example.com", password: "hashed_password", firstName: "Jane", lastName: "Smith" },
      { username: "admin", email: "admin@quotexwallet.com", password: "admin_password", firstName: "Admin", lastName: "User" },
    ];

    mockUsers.forEach((userData, index) => {
      const user: User = {
        ...userData,
        id: this.currentUserId++,
        isVerified: index < 2,
        isAdmin: index === 2, // Make the admin user an admin
        createdAt: new Date()
      };
      this.users.set(user.id, user);

      // Create portfolio for each user
      const portfolio: Portfolio = {
        id: this.currentPortfolioId++,
        userId: user.id,
        totalBalance: (Math.random() * 10000).toFixed(2),
        totalValue: (Math.random() * 10000).toFixed(2),
        updatedAt: new Date()
      };
      this.portfolios.set(portfolio.id, portfolio);
    });

    // Create some mock admin balance actions
    const mockActions = [
      { userId: 1, adminId: 3, action: "credit", amount: "1000.00", currency: "USD", reason: "Welcome bonus" },
      { userId: 2, adminId: 3, action: "credit", amount: "500.00", currency: "USD", reason: "Referral bonus" },
      { userId: 1, adminId: 3, action: "debit", amount: "50.00", currency: "USD", reason: "Transaction fee correction" },
    ];

    mockActions.forEach((actionData) => {
      const action: AdminBalanceAction = {
        ...actionData,
        id: this.currentAdminActionId++,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
      };
      this.adminBalanceActions.set(action.id, action);
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
      isAdmin: false,
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
      totalBalance: insertPortfolio.totalBalance || "0",
      totalValue: insertPortfolio.totalValue || "0",
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
      fee: insertTransaction.fee || "0",
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
        marketCap: insertAsset.marketCap || null,
        volume24h: insertAsset.volume24h || null,
        updatedAt: new Date()
      };
      this.cryptoAssets.set(insertAsset.symbol, asset);
      return asset;
    }
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAdminBalanceActions(): Promise<AdminBalanceAction[]> {
    return Array.from(this.adminBalanceActions.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createAdminBalanceAction(insertAction: InsertAdminBalanceAction): Promise<AdminBalanceAction> {
    const id = this.currentAdminActionId++;
    const action: AdminBalanceAction = {
      ...insertAction,
      id,
      currency: insertAction.currency || "USD",
      createdAt: new Date()
    };
    this.adminBalanceActions.set(id, action);
    return action;
  }

  async getUserBalanceActions(userId: number): Promise<AdminBalanceAction[]> {
    return Array.from(this.adminBalanceActions.values())
      .filter(action => action.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getPortfolio(userId: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId));
    return portfolio || undefined;
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await db
      .insert(portfolios)
      .values(insertPortfolio)
      .returning();
    return portfolio;
  }

  async updatePortfolio(userId: number, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .update(portfolios)
      .set(updates)
      .where(eq(portfolios.userId, userId))
      .returning();
    return portfolio || undefined;
  }

  async getHoldings(portfolioId: number): Promise<Holding[]> {
    return await db.select().from(holdings).where(eq(holdings.portfolioId, portfolioId));
  }

  async createHolding(insertHolding: InsertHolding): Promise<Holding> {
    const [holding] = await db
      .insert(holdings)
      .values(insertHolding)
      .returning();
    return holding;
  }

  async updateHolding(id: number, updates: Partial<Holding>): Promise<Holding | undefined> {
    const [holding] = await db
      .update(holdings)
      .set(updates)
      .where(eq(holdings.id, id))
      .returning();
    return holding || undefined;
  }

  async deleteHolding(id: number): Promise<boolean> {
    const result = await db.delete(holdings).where(eq(holdings.id, id));
    return result.rowCount > 0;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  async getCryptoAssets(): Promise<CryptoAsset[]> {
    return await db.select().from(cryptoAssets);
  }

  async getCryptoAsset(symbol: string): Promise<CryptoAsset | undefined> {
    const [asset] = await db.select().from(cryptoAssets).where(eq(cryptoAssets.symbol, symbol));
    return asset || undefined;
  }

  async createOrUpdateCryptoAsset(insertAsset: InsertCryptoAsset): Promise<CryptoAsset> {
    const existing = await this.getCryptoAsset(insertAsset.symbol);
    if (existing) {
      const [updated] = await db
        .update(cryptoAssets)
        .set(insertAsset)
        .where(eq(cryptoAssets.symbol, insertAsset.symbol))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(cryptoAssets)
        .values(insertAsset)
        .returning();
      return created;
    }
  }

  async getAdminBalanceActions(): Promise<AdminBalanceAction[]> {
    return await db.select().from(adminBalanceActions);
  }

  async createAdminBalanceAction(insertAction: InsertAdminBalanceAction): Promise<AdminBalanceAction> {
    const [action] = await db
      .insert(adminBalanceActions)
      .values(insertAction)
      .returning();
    return action;
  }

  async getUserBalanceActions(userId: number): Promise<AdminBalanceAction[]> {
    return await db.select().from(adminBalanceActions).where(eq(adminBalanceActions.userId, userId));
  }
}

export const storage = new DatabaseStorage();
