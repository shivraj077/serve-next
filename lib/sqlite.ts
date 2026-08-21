import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV);
const dbPath = isVercel
  ? path.join(os.tmpdir(), 'servnext.db')
  : path.join(process.cwd(), 'servnext.db');

let db: InstanceType<typeof Database> | null = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    if (!isVercel) {
      db.pragma('journal_mode = WAL');
    }
    initTables(db);
  }
  return db;
}

function initTables(database: InstanceType<typeof Database>) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      phone TEXT,
      role TEXT DEFAULT 'user',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS servers (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      plan TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      price REAL NOT NULL,
      status TEXT DEFAULT 'Running',
      purchaseDate TEXT DEFAULT CURRENT_TIMESTAMP,
      paymentId TEXT,
      paymentStatus TEXT DEFAULT 'Paid',
      razorpayOrderId TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

function formatUser(row: any) {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
  };
}

function formatServer(row: any) {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
  };
}

// User methods
export function findUserByEmail(email: string) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  return formatUser(user);
}

export function findUserById(id: string) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id);
  return formatUser(user);
}

export function createUser(userData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}) {
  const database = getDb();
  const id = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  const role = userData.role || 'user';

  const stmt = database.prepare(`
    INSERT INTO users (id, email, password, firstName, lastName, phone, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    userData.email,
    userData.password,
    userData.firstName || null,
    userData.lastName || null,
    userData.phone || null,
    role
  );

  return findUserById(id);
}

export function updateUserRole(userId: string, newRole: string) {
  const database = getDb();
  const stmt = database.prepare('UPDATE users SET role = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
  const result = stmt.run(newRole, userId);
  if (result.changes === 0) return null;
  return findUserById(userId);
}

export function deleteUser(userId: string) {
  const database = getDb();
  database.prepare('DELETE FROM servers WHERE userId = ?').run(userId);
  const stmt = database.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(userId);
  return result.changes > 0;
}

// Server methods
export function getServersByUserId(userId: string) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM servers WHERE userId = ? ORDER BY purchaseDate DESC');
  const rows = stmt.all(userId);
  return rows.map(formatServer);
}

export function createServer(serverData: {
  userId: string;
  plan: string;
  quantity: number;
  duration: number;
  price: number;
  status?: string;
  paymentId?: string;
  paymentStatus?: string;
  razorpayOrderId?: string;
}) {
  const database = getDb();
  const id = 'srv_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);

  const stmt = database.prepare(`
    INSERT INTO servers (id, userId, plan, quantity, duration, price, status, paymentId, paymentStatus, razorpayOrderId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    serverData.userId,
    serverData.plan,
    serverData.quantity,
    serverData.duration,
    serverData.price,
    serverData.status || 'Running',
    serverData.paymentId || null,
    serverData.paymentStatus || 'Paid',
    serverData.razorpayOrderId || null
  );

  const newServer = database.prepare('SELECT * FROM servers WHERE id = ?').get(id);
  return formatServer(newServer);
}

export function getAllServersWithUsers() {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT 
      servers.*,
      users.id as u_id,
      users.email as u_email,
      users.firstName as u_firstName,
      users.lastName as u_lastName,
      users.role as u_role
    FROM servers
    LEFT JOIN users ON servers.userId = users.id
    ORDER BY servers.purchaseDate DESC
  `);

  const rows = stmt.all() as any[];
  return rows.map((r) => ({
    _id: r.id,
    id: r.id,
    plan: r.plan,
    quantity: r.quantity,
    duration: r.duration,
    price: r.price,
    status: r.status,
    purchaseDate: r.purchaseDate,
    paymentId: r.paymentId,
    paymentStatus: r.paymentStatus,
    razorpayOrderId: r.razorpayOrderId,
    userId: r.u_id ? {
      _id: r.u_id,
      id: r.u_id,
      email: r.u_email,
      firstName: r.u_firstName,
      lastName: r.u_lastName,
      role: r.u_role,
    } : null
  }));
}
