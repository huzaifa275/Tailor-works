import { Customer, OrderStatus, ShopAccount } from './types';

const STORAGE_KEY = 'tailor_management_customers';
const AUTH_KEY = 'tailor_management_auth';

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    shopEmail: 'tailor@darzi.pk',
    name: 'Muhammad Ali',
    mobile: '03001234567',
    date: '2026-06-20',
    measurements: {
      qameezLength: '42',
      shoulder: '18.5',
      sleeve: '24',
      chest: '40',
      collar: '15.5',
      trouserLength: '40',
      waist: '36',
      hip: '42',
      thigh: '26',
      bottom: '18'
    },
    additionalNotes: 'Double stitching on front pocket. Soft collar required.',
    totalPrice: 3500,
    advancePayment: 1500,
    remainingAmount: 2000,
    deliveryDate: '2026-06-28',
    status: OrderStatus.PENDING,
    createdAt: new Date('2026-06-20T10:00:00Z').toISOString()
  },
  {
    id: 'cust-2',
    shopEmail: 'tailor@darzi.pk',
    name: 'Zubair Ahmad',
    mobile: '03129876543',
    date: '2026-06-22',
    measurements: {
      qameezLength: '40.5',
      shoulder: '17.5',
      sleeve: '23',
      chest: '38',
      collar: '15',
      trouserLength: '39',
      waist: '34',
      hip: '40',
      thigh: '24',
      bottom: '17.5'
    },
    additionalNotes: 'Ban collar, open cuff sleeves.',
    totalPrice: 4000,
    advancePayment: 4000,
    remainingAmount: 0,
    deliveryDate: '2026-06-26',
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date('2026-06-22T11:30:00Z').toISOString()
  },
  {
    id: 'cust-3',
    shopEmail: 'tailor@darzi.pk',
    name: 'Kamran Khan',
    mobile: '03214567890',
    date: '2026-06-18',
    measurements: {
      qameezLength: '44',
      shoulder: '19.5',
      sleeve: '25.5',
      chest: '44',
      collar: '16.5',
      trouserLength: '42',
      waist: '38',
      hip: '46',
      thigh: '28',
      bottom: '19'
    },
    additionalNotes: 'Shalwar with side pockets. Heavy starch.',
    totalPrice: 3800,
    advancePayment: 1000,
    remainingAmount: 2800,
    deliveryDate: '2026-06-25',
    status: OrderStatus.READY,
    createdAt: new Date('2026-06-18T09:15:00Z').toISOString()
  },
  {
    id: 'cust-4',
    shopEmail: 'tailor@darzi.pk',
    name: 'Asif Mahmood',
    mobile: '03335551234',
    date: '2026-06-15',
    measurements: {
      qameezLength: '41',
      shoulder: '18',
      sleeve: '23.5',
      chest: '39',
      collar: '15',
      trouserLength: '39.5',
      waist: '35',
      hip: '41',
      thigh: '25',
      bottom: '17'
    },
    additionalNotes: 'Simple embroidery on collar and cuff. Gift pack.',
    totalPrice: 4500,
    advancePayment: 2500,
    remainingAmount: 2000,
    deliveryDate: '2026-06-23',
    status: OrderStatus.DELIVERED,
    createdAt: new Date('2026-06-15T14:20:00Z').toISOString()
  }
];

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

const SEED_SHOPS: ShopAccount[] = [
  {
    id: 'shop-1',
    shopName: 'Al-Makkah Tailors',
    fullName: 'Mohammad Ali',
    mobileNumber: '03001234567',
    email: 'tailor@darzi.pk',
    password: 'darzi123',
    status: 'Active',
    plan: 'Free Trial',
    createdAt: new Date('2026-06-01T00:00:00Z').toISOString()
  },
  {
    id: 'shop-2',
    shopName: 'Al-Noor Boutique',
    fullName: 'Noor-ul-Hassan',
    mobileNumber: '03217654321',
    email: 'alnoor@darzi.pk',
    password: 'darzi123',
    status: 'Active',
    plan: 'Monthly Plan',
    expiryDate: '2026-07-25',
    createdAt: new Date('2026-06-10T00:00:00Z').toISOString()
  },
  {
    id: 'shop-3',
    shopName: 'Karachi Royal Darzi',
    fullName: 'Shahzad Ahmed',
    mobileNumber: '03339876543',
    email: 'karachi@darzi.pk',
    password: 'darzi123',
    status: 'Suspended',
    plan: 'Lifetime Plan',
    createdAt: new Date('2026-06-15T00:00:00Z').toISOString()
  }
];

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
  const signupDate = new Date();
  
  // Trial Duration = 3 Days
  const expiryDate = new Date(signupDate);
  expiryDate.setDate(signupDate.getDate() + 3);
  const expiryStr = expiryDate.toISOString().split('T')[0];

  const newShop: ShopAccount = {
    ...shop,
    id: 'shop-' + Date.now(),
    status: 'Active', // Automatically assign Active Status
    plan: 'Free Trial', // Automatically assign Trial Plan
    expiryDate: expiryStr, // Expiry Date = Signup Date + 3 Days
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

