import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Database paths
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Ensure data directory and files exist with seeded data
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Seed Users
  if (!fs.existsSync(USERS_FILE)) {
    const seedUsers = [
      {
        id: "usr_admin",
        name: "Shop Admin",
        email: "admin@example.com",
        password: "admin123", // Stored plainly for ease of demonstration in a test sandbox
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_user1",
        name: "Alex Johnson",
        email: "visitor@example.com",
        password: "visitor123",
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(seedUsers, null, 2));
    console.log("Seeded database: users.json");
  }

  // Seed Products
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const seedProducts = [
      {
        id: "prod_1",
        name: "Acoustic Noise-Canceling Headphones",
        description: "Immersive sound with high-fidelity acoustics and smart active noise cancellation. Features 40-hour battery life and memory foam earcups for exceptional all-day comfort.",
        price: 299,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
        stock: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: "prod_2",
        name: "Minimalist Mechanical Keyboard",
        description: "Compact 75% mechanical layout featuring tactile brown switches, pre-lubed stabilizers, and clean dual-tone keycaps. Wrapped in a premium aluminum case with custom warm-white backlighting.",
        price: 149,
        category: "Workplace",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
        stock: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: "prod_3",
        name: "Walnut Monitor Stand & Riser",
        description: "Handcrafted from solid North American walnut wood. Lifts your monitor to an ergonomic height while offering an elegant minimalist storage shelf underneath for accessories.",
        price: 89,
        category: "Workplace",
        image: "https://images.unsplash.com/photo-1527443195091-2a59a34eb97c?auto=format&fit=crop&q=80&w=600",
        stock: 20,
        createdAt: new Date().toISOString(),
      },
      {
        id: "prod_4",
        name: "Glazed Speckled Ceramic Mug",
        description: "Meticulously hand-thrown on a potter's wheel in speckled stoneware. Coated in a gorgeous satin white rutile glaze. Each mug boasts micro-variation, holding 12oz of your favorite brew.",
        price: 29,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600",
        stock: 35,
        createdAt: new Date().toISOString(),
      },
      {
        id: "prod_5",
        name: "Classique Leather Zippered Wallet",
        description: "Sourced from full-grain hand-finished Italian leather. Keeps cash, cards, and coins exceptionally secure with high-grade brass zippers. Slim pocket profile with robust RFID shielding.",
        price: 69,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600",
        stock: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: "prod_6",
        name: "Modular Waterproof commuter Backpack",
        description: "Rugged yet modern utility design. Uses TPU-coated Cordura fabric with fully waterproof zippers. Features dedicated 16-inch laptop pocket, hidden passports compartment, and key clips.",
        price: 119,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
        stock: 6,
        createdAt: new Date().toISOString(),
      }
    ];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seedProducts, null, 2));
    console.log("Seeded database: products.json");
  }

  // Seed Orders
  if (!fs.existsSync(ORDERS_FILE)) {
    const seedOrders = [
      {
        id: "ord_1",
        userId: "usr_user1",
        userName: "Alex Johnson",
        userEmail: "visitor@example.com",
        items: [
          {
            id: "item_1",
            productId: "prod_3",
            name: "Walnut Monitor Stand & Riser",
            price: 89,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1527443195091-2a59a34eb97c?auto=format&fit=crop&q=80&w=600"
          },
          {
            id: "item_2",
            productId: "prod_4",
            name: "Glazed Speckled Ceramic Mug",
            price: 29,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600"
          }
        ],
        total: 147,
        status: "processing",
        shippingAddress: {
          fullName: "Alex Johnson",
          addressLine1: "123 Serene Valley Trail",
          city: "San Francisco",
          state: "CA",
          postalCode: "94107",
          country: "United States"
        },
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      }
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(seedOrders, null, 2));
    console.log("Seeded database: orders.json");
  }
}

initDB();

// Helper functions
function readData(filePath: string) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeData(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Authentication Middleware & Verification Functions
function getUserFromToken(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  
  // Custom simple token encoding: `id||email||role`
  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [id, email, role] = decoded.split("||");
    if (!id || !email || !role) return null;
    return { id, email, role };
  } catch (e) {
    return null;
  }
}

function createToken(user: any) {
  const data = `${user.id}||${user.email}||${user.role}`;
  return Buffer.from(data).toString('base64');
}

// ==========================================
// API Endpoints
// ==========================================

// --- Authentication ---
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const users = readData(USERS_FILE);
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = createToken(user);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required." });
    return;
  }

  const users = readData(USERS_FILE);
  const exists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    res.status(400).json({ error: "Email already registered." });
    return;
  }

  const newUser = {
    id: "usr_" + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    role: "user", // Default is student/user role. Admins are preconfigured or modified.
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(USERS_FILE, users);

  const token = createToken(newUser);
  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    },
    token
  });
});

app.get("/api/auth/me", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller) {
    res.status(401).json({ error: "Unauthorized access." });
    return;
  }
  const users = readData(USERS_FILE);
  const user = users.find((u: any) => u.id === caller.id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});


// --- Product Directory ---
app.get("/api/products", (req, res) => {
  const products = readData(PRODUCTS_FILE);
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const product = products.find((p: any) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }
  res.json(product);
});

// Create product (Admin only)
app.post("/api/products", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller || caller.role !== "admin") {
    res.status(403).json({ error: "Admin access only." });
    return;
  }

  const { name, description, price, category, image, stock } = req.body;
  if (!name || !price || category === undefined || stock === undefined) {
    res.status(400).json({ error: "Missing required product parameters (name, price, category, stock)." });
    return;
  }

  const products = readData(PRODUCTS_FILE);
  const newProduct = {
    id: "prod_" + Math.random().toString(36).substr(2, 9),
    name,
    description: description || "",
    price: Number(price),
    category: category || "Uncategorized",
    image: image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
    stock: Number(stock),
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct); // Add to the top
  writeData(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

// Update product (Admin Only)
app.put("/api/products/:id", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller || caller.role !== "admin") {
    res.status(403).json({ error: "Admin access only." });
    return;
  }

  const products = readData(PRODUCTS_FILE);
  const index = products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  const existing = products[index];
  const { name, description, price, category, image, stock } = req.body;

  products[index] = {
    ...existing,
    name: name !== undefined ? name : existing.name,
    description: description !== undefined ? description : existing.description,
    price: price !== undefined ? Number(price) : existing.price,
    category: category !== undefined ? category : existing.category,
    image: image !== undefined ? image : existing.image,
    stock: stock !== undefined ? Number(stock) : existing.stock,
  };

  writeData(PRODUCTS_FILE, products);
  res.json(products[index]);
});

// Delete product (Admin Only)
app.delete("/api/products/:id", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller || caller.role !== "admin") {
    res.status(403).json({ error: "Admin access only." });
    return;
  }

  const products = readData(PRODUCTS_FILE);
  const filtered = products.filter((p: any) => p.id !== req.params.id);
  if (filtered.length === products.length) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  writeData(PRODUCTS_FILE, filtered);
  res.json({ success: true, id: req.params.id });
});


// --- Orders System ---

// List orders (All orders for Admin, or only user's own orders for users)
app.get("/api/orders", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller) {
    res.status(401).json({ error: "Login required to fetch orders." });
    return;
  }

  const orders = readData(ORDERS_FILE);

  if (caller.role === "admin") {
    res.json(orders);
  } else {
    const userOrders = orders.filter((o: any) => o.userId === caller.id);
    res.json(userOrders);
  }
});

// Create Order (Checkout)
app.post("/api/orders", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller) {
    res.status(401).json({ error: "Login is required to place an order." });
    return;
  }

  const { items, shippingAddress } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
    res.status(400).json({ error: "Invalid order payload structure. Items and shipping address are required." });
    return;
  }

  // Load products to verify prices and stock availability
  const products = readData(PRODUCTS_FILE);
  const updatedProducts = [...products];
  const verifiedItems = [];
  let calculatedTotal = 0;

  for (const item of items) {
    const dbProduct = updatedProducts.find((p: any) => p.id === item.productId);
    if (!dbProduct) {
      res.status(404).json({ error: `Product with ID ${item.productId} was not found.` });
      return;
    }

    if (dbProduct.stock < item.quantity) {
      res.status(400).json({ error: `Insufficient stock for product '${dbProduct.name}'. Available: ${dbProduct.stock}, requested: ${item.quantity}.` });
      return;
    }

    // Deduct stock
    dbProduct.stock -= item.quantity;
    calculatedTotal += dbProduct.price * item.quantity;

    verifiedItems.push({
      id: "item_" + Math.random().toString(36).substr(2, 9),
      productId: dbProduct.id,
      name: dbProduct.name,
      price: dbProduct.price,
      quantity: item.quantity,
      image: dbProduct.image,
    });
  }

  // Double check user info
  const users = readData(USERS_FILE);
  const dbUser = users.find((u: any) => u.id === caller.id);
  const userName = dbUser ? dbUser.name : "Registered User";
  const userEmail = dbUser ? dbUser.email : caller.email;

  const newOrder = {
    id: "ord_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    userId: caller.id,
    userName,
    userEmail,
    items: verifiedItems,
    total: calculatedTotal,
    status: "pending",
    shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Persist updated product stock levels and save new order
  writeData(PRODUCTS_FILE, updatedProducts);

  const orders = readData(ORDERS_FILE);
  orders.unshift(newOrder);
  writeData(ORDERS_FILE, orders);

  res.status(201).json(newOrder);
});

// Update Order status (Admin Only)
app.put("/api/orders/:id/status", (req, res) => {
  const caller = getUserFromToken(req);
  if (!caller || caller.role !== "admin") {
    res.status(403).json({ error: "Admin access only." });
    return;
  }

  const { status } = req.body;
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    return;
  }

  const orders = readData(ORDERS_FILE);
  const index = orders.findIndex((o: any) => o.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Order not found." });
    return;
  }

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();

  writeData(ORDERS_FILE, orders);
  res.json(orders[index]);
});

// ==========================================
// Client Assets & Vite Delivery
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
