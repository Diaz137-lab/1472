import { db } from "./db";
import { 
  users, portfolios, cryptoAssets, adminBalanceActions,
  type User, type Portfolio, type CryptoAsset, type AdminBalanceAction
} from "@shared/schema";

async function initializeDatabase() {
  console.log("🚀 Initializing database with seed data...");
  
  try {
    // Initialize popular crypto assets
    const mockAssets = [
      { symbol: "BTC", name: "Bitcoin", currentPrice: "108524.84", priceChange24h: "1.19", marketCap: "2145000000000", volume24h: "45000000000" },
      { symbol: "ETH", name: "Ethereum", currentPrice: "2501.37", priceChange24h: "2.98", marketCap: "301000000000", volume24h: "15000000000" },
      { symbol: "DOGE", name: "Dogecoin", currentPrice: "0.17", priceChange24h: "3.01", marketCap: "25000000000", volume24h: "2000000000" },
      { symbol: "SOL", name: "Solana", currentPrice: "152.31", priceChange24h: "1.77", marketCap: "72000000000", volume24h: "3500000000" },
      { symbol: "ADA", name: "Cardano", currentPrice: "0.45", priceChange24h: "-1.25", marketCap: "16000000000", volume24h: "800000000" },
      { symbol: "DOT", name: "Polkadot", currentPrice: "6.85", priceChange24h: "0.95", marketCap: "9500000000", volume24h: "450000000" }
    ];

    // Insert crypto assets
    for (const asset of mockAssets) {
      await db.insert(cryptoAssets).values({
        symbol: asset.symbol,
        name: asset.name,
        currentPrice: asset.currentPrice,
        priceChange24h: asset.priceChange24h,
        marketCap: asset.marketCap,
        volume24h: asset.volume24h,
        price: asset.currentPrice,
        change24h: asset.priceChange24h,
        updatedAt: new Date()
      }).onConflictDoNothing();
    }
    console.log("✅ Crypto assets initialized");

    // Create 5 test users including Kelly Ann James
    const testUsers = [
      { 
        username: "kellyann", 
        email: "seantellelopez@gmail.com", 
        password: "hashed_password", 
        firstName: "Kelly Ann", 
        lastName: "James",
        address: "58 Benjamina Drive, Red Bank Plains, Queensland, Australia"
      },
      { 
        username: "johndoe", 
        email: "john@example.com", 
        password: "hashed_password", 
        firstName: "John", 
        lastName: "Doe",
        address: "123 Main St, New York, NY, USA"
      },
      { 
        username: "janesmith", 
        email: "jane@example.com", 
        password: "hashed_password", 
        firstName: "Jane", 
        lastName: "Smith",
        address: "456 Oak Ave, Los Angeles, CA, USA"
      },
      { 
        username: "mikebrown", 
        email: "mike@example.com", 
        password: "hashed_password", 
        firstName: "Mike", 
        lastName: "Brown",
        address: "789 Pine Rd, Chicago, IL, USA"
      },
      { 
        username: "sarahwilson", 
        email: "sarah@example.com", 
        password: "hashed_password", 
        firstName: "Sarah", 
        lastName: "Wilson",
        address: "321 Elm St, Miami, FL, USA"
      }
    ];

    // Insert users and create their portfolios with $0 balance
    for (const userData of testUsers) {
      const [user] = await db.insert(users).values({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        isVerified: true,
        isAdmin: false,
        createdAt: new Date()
      }).returning().onConflictDoNothing();

      if (user) {
        // Create portfolio with $0 balance for each user
        await db.insert(portfolios).values({
          userId: user.id,
          totalBalance: "0.00",
          totalValue: "0.00",
          updatedAt: new Date()
        }).onConflictDoNothing();
      }
    }
    console.log("✅ Test users created with $0 balances");

    // Create admin balance action to initialize system with $20,000,000
    await db.insert(adminBalanceActions).values({
      userId: 1, // Kelly Ann James gets the first user ID
      adminId: 1, // Self-administration for initial setup
      action: "system_init",
      amount: "20000000.00",
      currency: "USD",
      reason: "Initial system balance setup - Admin reserve fund",
      createdAt: new Date()
    }).onConflictDoNothing();
    console.log("✅ Admin balance action created for $20,000,000 system initialization");

    console.log("🎉 Database initialization completed successfully!");
    
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log("Database initialization complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database initialization failed:", error);
      process.exit(1);
    });
}

export { initializeDatabase };