import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address"),
  isVerified: boolean("is_verified").default(false),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalBalance: decimal("total_balance", { precision: 18, scale: 8 }).default("0"),
  totalValue: decimal("total_value", { precision: 18, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  averagePrice: decimal("average_price", { precision: 18, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'buy', 'sell', 'swap'
  symbol: text("symbol").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 2 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 2 }).default("0"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const cryptoAssets = pgTable("crypto_assets", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 2 }).notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 5, scale: 2 }).notNull(),
  marketCap: decimal("market_cap", { precision: 18, scale: 2 }),
  volume24h: decimal("volume_24h", { precision: 18, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminBalanceActions = pgTable("admin_balance_actions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  adminId: integer("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(), // 'credit', 'debit', 'withdrawal'
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  reason: text("reason").notNull(),
  walletAddress: text("wallet_address"), // For crypto transactions
  transactionHash: text("transaction_hash"), // For blockchain verification
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  address: true,
});

export const insertAdminBalanceActionSchema = createInsertSchema(adminBalanceActions).pick({
  userId: true,
  adminId: true,
  action: true,
  amount: true,
  currency: true,
  reason: true,
  walletAddress: true,
  transactionHash: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).pick({
  userId: true,
  totalBalance: true,
  totalValue: true,
});

export const insertHoldingSchema = createInsertSchema(holdings).pick({
  portfolioId: true,
  symbol: true,
  name: true,
  amount: true,
  averagePrice: true,
  currentPrice: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  symbol: true,
  amount: true,
  price: true,
  fee: true,
});

export const insertCryptoAssetSchema = createInsertSchema(cryptoAssets).pick({
  symbol: true,
  name: true,
  currentPrice: true,
  priceChange24h: true,
  marketCap: true,
  volume24h: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdings.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertCryptoAsset = z.infer<typeof insertCryptoAssetSchema>;
export type CryptoAsset = typeof cryptoAssets.$inferSelect;
export type InsertAdminBalanceAction = z.infer<typeof insertAdminBalanceActionSchema>;
export type AdminBalanceAction = typeof adminBalanceActions.$inferSelect;
