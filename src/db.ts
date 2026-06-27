import { Customer, OrderStatus, ShopAccount, UserAccount } from './types';

const STORAGE_KEY = 'tailor_management_customers';
const AUTH_KEY = 'tailor_management_auth';

const SEED_CUSTOMERS: Customer[] = [];

export function getCustomers(shopEmail?: string): Customer[] {
  const data = localStorage.getItem(STORAGE_KEY);
  let list: Customer[] = [];
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CUSTOMERS));
    list = SEED_CUSTOMERS;
  } else {
    try {
      list = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse customers from localStorage', e);
      list = SEED_CUSTOMERS;
    }
  }

  const activeEmail = shopEmail || getAuthUser();
  if (!activeEmail) {
    return [];
  }

  if (activeEmail === 'Huzaifa' || activeEmail === 'huzaifa@darzi.pk') {
    return list;
  }
  
  return list.filter(c => c.shopEmail === activeEmail || (!c.shopEmail && activeEmail === 'tailor@darzi.pk'));
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'remainingAmount'>): Customer {
  const data = localStorage.getItem(STORAGE_KEY);
  let customers: Customer[] = [];
  if (data) {
    try {
      customers = JSON.parse(data);
    } catch (e) {
      customers = [];
    }
  }
  const newCustomer: Customer = {
    ...customer,
    id: 'cust-' + Date.now(),
    remainingAmount: Math.max(0, customer.totalPrice - customer.advancePayment),
    createdAt: new Date().toISOString()
  };
  customers.unshift(newCustomer); // Newest first
  saveCustomers(customers);
  return newCustomer;
}

export function updateCustomer(id: string, updatedFields: Partial<Omit<Customer, 'id' | 'createdAt'>>): Customer {
  const data = localStorage.getItem(STORAGE_KEY);
  let customers: Customer[] = [];
  if (data) {
    try {
      customers = JSON.parse(data);
    } catch (e) {
      customers = [];
    }
  }
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Customer not found');
  }

  const existing = customers[index];
  const merged = { ...existing, ...updatedFields };
  
  // Re-calculate remaining amount if prices changed
  if ('totalPrice' in updatedFields || 'advancePayment' in updatedFields) {
    merged.remainingAmount = Math.max(0, (merged.totalPrice || 0) - (merged.advancePayment || 0));
  }

  customers[index] = merged;
  saveCustomers(customers);
  return merged;
}

export function deleteCustomer(id: string): void {
  const data = localStorage.getItem(STORAGE_KEY);
  let customers: Customer[] = [];
  if (data) {
    try {
      customers = JSON.parse(data);
    } catch (e) {
      customers = [];
    }
  }
  const filtered = customers.filter(c => c.id !== id);
  saveCustomers(filtered);
}

// Shops database management
const SHOPS_KEY = 'tailor_management_shops';
const USERS_KEY = 'tailor_management_users';

export function getUsers(): UserAccount[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse users from localStorage', e);
    return [];
  }
}

export function saveUsers(users: UserAccount[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const SEED_SHOPS: ShopAccount[] = [];

export function getBrowserDeviceId(): string {
  let devId = localStorage.getItem('darzi_ledger_device_id');
  if (!devId) {
    devId = 'device-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
    localStorage.setItem('darzi_ledger_device_id', devId);
  }
  return devId;
}

export function getShops(): ShopAccount[] {
  const data = localStorage.getItem(SHOPS_KEY);
  let shops: ShopAccount[] = [];
  if (!data) {
    localStorage.setItem(SHOPS_KEY, JSON.stringify(SEED_SHOPS));
    shops = SEED_SHOPS;
  } else {
    try {
      shops = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse shops from localStorage', e);
      shops = SEED_SHOPS;
    }
  }

  // Auto-lock expired monthly and trial subscriptions
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let changed = false;
  const checkedShops = shops.map(shop => {
    let expiry = shop.expiryDate;
    
    // Automatically fill Free Trial expiryDate if missing (today + 3 days or created + 3 days)
    if (!expiry && shop.plan === 'Free Trial') {
      const baseDate = shop.createdAt ? new Date(shop.createdAt) : new Date();
      baseDate.setDate(baseDate.getDate() + 3);
      expiry = baseDate.toISOString().split('T')[0];
      changed = true;
    }

    if ((shop.plan === 'Monthly Plan' || shop.plan === 'Free Trial') && expiry && expiry < todayStr && shop.status === 'Active') {
      changed = true;
      return { ...shop, expiryDate: expiry, status: 'Expired' as const };
    }

    if (expiry !== shop.expiryDate) {
      changed = true;
      return { ...shop, expiryDate: expiry };
    }

    return shop;
  });

  if (changed) {
    localStorage.setItem(SHOPS_KEY, JSON.stringify(checkedShops));
    return checkedShops;
  }

  return shops;
}

export function saveShops(shops: ShopAccount[]): void {
  localStorage.setItem(SHOPS_KEY, JSON.stringify(shops));
}

export function addShop(shop: Omit<ShopAccount, 'id' | 'createdAt'>): ShopAccount {
  const shops = getShops();
  const users = getUsers();
  const signupDate = new Date();
  
  const emailLower = shop.email.trim().toLowerCase();

  // Create or retrieve corresponding UserAccount (Single Transaction Setup)
  let user = users.find(u => u.email.toLowerCase() === emailLower);
  const userId = user ? user.id : 'user-' + Date.now();
  if (!user) {
    user = {
      id: userId,
      email: emailLower,
      password: shop.password || 'darzi123',
      fullName: shop.fullName.trim(),
      mobileNumber: shop.mobileNumber.trim(),
      createdAt: signupDate.toISOString()
    };
    users.unshift(user);
    saveUsers(users);
  }

  // Trial Duration = 3 Days
  const expiryDate = new Date(signupDate);
  expiryDate.setDate(signupDate.getDate() + 3);
  const expiryStr = expiryDate.toISOString().split('T')[0];

  const newShop: ShopAccount = {
    ...shop,
    email: emailLower,
    userId: userId, // Link user ID with shop/workspace
    id: 'shop-' + Date.now(),
    status: shop.status || 'Active', // Automatically assign Active Status
    plan: shop.plan || 'Free Trial', // Automatically assign Trial Plan
    expiryDate: shop.expiryDate || (shop.plan === 'Monthly Plan' ? undefined : expiryStr),
    createdAt: signupDate.toISOString()
  };
  shops.unshift(newShop);
  saveShops(shops);
  return newShop;
}

export function updateShop(id: string, updatedFields: Partial<Omit<ShopAccount, 'id' | 'createdAt'>>): ShopAccount {
  const shops = getShops();
  const index = shops.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Shop not found');
  }
  const existing = shops[index];
  const merged = { ...existing, ...updatedFields };
  shops[index] = merged;
  saveShops(shops);
  return merged;
}

export function deleteShop(id: string): void {
  const shops = getShops();
  const filtered = shops.filter(s => s.id !== id);
  saveShops(filtered);
}

// Authentication dummy state
export function getAuthUser(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function loginUser(email: string): void {
  localStorage.setItem(AUTH_KEY, email);
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export interface BackupData {
  backupType: 'darzi_ledger_backup';
  version: string;
  exportedAt: string;
  shopEmail: string;
  shop: ShopAccount;
  customers: Customer[];
}

export function exportShopData(email: string): string {
  const shops = getShops();
  const shop = shops.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (!shop) {
    throw new Error('Shop account not found');
  }
  const allCustomers = getCustomers(email);
  
  const backup: BackupData = {
    backupType: 'darzi_ledger_backup',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    shopEmail: email,
    shop: shop,
    customers: allCustomers
  };
  
  return JSON.stringify(backup, null, 2);
}

export function importShopBackup(
  backupStr: string,
  mode: 'merge' | 'replace',
  expectedEmail?: string
): { success: boolean; email: string; message: string } {
  let backup: any;
  try {
    backup = JSON.parse(backupStr);
  } catch (e) {
    throw new Error('Invalid backup file. The file is corrupted or not in JSON format.');
  }

  if (!backup || backup.backupType !== 'darzi_ledger_backup') {
    throw new Error('Invalid backup file. This file was not generated by Darzi Ledger.');
  }

  if (!backup.shopEmail || !backup.shop) {
    throw new Error('Invalid backup data. Shop details are missing.');
  }

  const email = backup.shopEmail.toLowerCase();

  if (expectedEmail && expectedEmail.toLowerCase() !== email) {
    throw new Error(`Account mismatch. This backup belongs to "${email}", but you are logged in as "${expectedEmail}".`);
  }

  const shops = getShops();
  const shopIndex = shops.findIndex(s => s.email.toLowerCase() === email);
  
  if (shopIndex !== -1) {
    shops[shopIndex] = {
      ...shops[shopIndex],
      ...backup.shop,
      deviceId: shops[shopIndex].deviceId || backup.shop.deviceId
    };
  } else {
    shops.unshift(backup.shop);
  }
  saveShops(shops);

  const rawCustomersData = localStorage.getItem(STORAGE_KEY);
  let localCustomers: Customer[] = [];
  if (rawCustomersData) {
    try {
      localCustomers = JSON.parse(rawCustomersData);
    } catch (e) {
      localCustomers = [];
    }
  }

  const backupCustomers: Customer[] = backup.customers || [];

  if (mode === 'replace') {
    const otherShopsCustomers = localCustomers.filter(c => c.shopEmail?.toLowerCase() !== email);
    const restoredCustomers = backupCustomers.map(c => ({ ...c, shopEmail: email }));
    const mergedList = [...restoredCustomers, ...otherShopsCustomers];
    saveCustomers(mergedList);
  } else {
    const map = new Map<string, Customer>();
    localCustomers.forEach(c => {
      map.set(c.id, c);
    });
    backupCustomers.forEach(c => {
      map.set(c.id, { ...c, shopEmail: email });
    });
    saveCustomers(Array.from(map.values()));
  }

  return {
    success: true,
    email: email,
    message: `Data restored successfully! ${backupCustomers.length} customers imported.`
  };
}

