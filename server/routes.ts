import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema, insertAdminBalanceActionSchema } from "@shared/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secure-admin-secret-key";

const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Middleware to verify admin token
const verifyAdminToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Create initial portfolio
      await storage.createPortfolio({
        userId: user.id,
        totalBalance: "0",
        totalValue: "0"
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  // Crypto assets routes
  app.get("/api/crypto/assets", async (req, res) => {
    try {
      const assets = await storage.getCryptoAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crypto assets" });
    }
  });

  app.get("/api/crypto/assets/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const asset = await storage.getCryptoAsset(symbol.toUpperCase());
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crypto asset" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      const holdings = await storage.getHoldings(portfolio.id);
      res.json({ ...portfolio, holdings });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Trading routes
  app.post("/api/trade", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Validate crypto asset exists
      const asset = await storage.getCryptoAsset(transactionData.symbol);
      if (!asset) {
        return res.status(400).json({ message: "Invalid crypto asset" });
      }
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Simulate processing
      setTimeout(async () => {
        await storage.updateTransaction(transaction.id, { status: "completed" });
        
        // Update portfolio holdings
        const portfolio = await storage.getPortfolio(transactionData.userId);
        if (portfolio) {
          const holdings = await storage.getHoldings(portfolio.id);
          const existingHolding = holdings.find(h => h.symbol === transactionData.symbol);
          
          if (transactionData.type === "buy") {
            if (existingHolding) {
              const newAmount = parseFloat(existingHolding.amount) + parseFloat(transactionData.amount);
              const newAveragePrice = (
                (parseFloat(existingHolding.amount) * parseFloat(existingHolding.averagePrice) + 
                 parseFloat(transactionData.amount) * parseFloat(transactionData.price)) / newAmount
              ).toFixed(2);
              
              await storage.updateHolding(existingHolding.id, {
                amount: newAmount.toString(),
                averagePrice: newAveragePrice,
                currentPrice: transactionData.price
              });
            } else {
              await storage.createHolding({
                portfolioId: portfolio.id,
                symbol: transactionData.symbol,
                name: asset.name,
                amount: transactionData.amount,
                averagePrice: transactionData.price,
                currentPrice: transactionData.price
              });
            }
          }
        }
      }, 1000);
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Transaction history
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      // You can customize these credentials or store them in a database
      const validAdmins = [
        { id: 1, username: "admin", password: "admin123", name: "System Administrator" },
        { id: 2, username: "superadmin", password: "super123", name: "Super Administrator" }
      ];
      
      const admin = validAdmins.find(a => a.username === username && a.password === password);
      
      if (!admin) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      const token = jwt.sign(
        { id: admin.id, username: admin.username, name: admin.name },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      
      const { password: _, ...adminWithoutPassword } = admin;
      res.json({ 
        token, 
        admin: adminWithoutPassword,
        message: "Admin authentication successful"
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/users", verifyAdminToken, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/balance-action", verifyAdminToken, async (req, res) => {
    try {
      const actionData = insertAdminBalanceActionSchema.parse(req.body);
      
      // Verify user exists
      const user = await storage.getUser(actionData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const action = await storage.createAdminBalanceAction(actionData);
      
      // Update user's portfolio balance based on the action
      const portfolio = await storage.getPortfolio(actionData.userId);
      if (portfolio) {
        const currentBalance = parseFloat(portfolio.totalBalance || "0");
        const actionAmount = parseFloat(actionData.amount);
        
        let newBalance: number;
        if (actionData.action === "credit") {
          newBalance = currentBalance + actionAmount;
        } else {
          newBalance = Math.max(0, currentBalance - actionAmount);
        }
        
        await storage.updatePortfolio(actionData.userId, {
          totalBalance: newBalance.toFixed(2),
          totalValue: newBalance.toFixed(2)
        });
      }
      
      res.json(action);
    } catch (error) {
      res.status(400).json({ message: "Invalid action data" });
    }
  });

  app.get("/api/admin/balance-actions", verifyAdminToken, async (req, res) => {
    try {
      const actions = await storage.getAdminBalanceActions();
      res.json(actions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch balance actions" });
    }
  });

  app.get("/api/admin/user-balance-actions/:userId", verifyAdminToken, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const actions = await storage.getUserBalanceActions(userId);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user balance actions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
