export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  READY = 'Ready',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed'
}

export interface Measurements {
  qameezLength: string; // in inches (e.g. "40", "40.5")
  shoulder: string;
  sleeve: string;
  chest: string;
  collar: string;
  trouserLength: string;
  waist: string;
  hip: string;
  thigh: string;
  bottom: string;
  
  // Traditional Pakistani register fields
  qameez?: string; // Qameez (قمیض)
  shirt?: string; // Shirt (شرٹ)
  waistCoat?: string; // Waist Coat (ویسٹ کوٹ)
  ghera?: string; // Ghera (گھیرا)
  pockets?: string; // Pockets (پاکٹس)
  shalwar?: string; // Shalwar (شلوار)

  // Stitching Options
  stitchingFront?: string; // Front (فرنٹ)
  stitchingCollarDesign?: string; // Collar Design (کالر ڈیزائن)
  stitchingCuff?: string; // Cuff (کف)
  stitchingSide?: string; // Side (سائیڈ)
  stitchingPocketStyle?: string; // Pocket Style (جیب)
  stitchingStep?: string; // Step (اسٹیپ)
}

export interface Customer {
  id: string;
  shopEmail?: string; // Associated shop email
  name: string;
  mobile: string;
  date: string; // "YYYY-MM-DD"
  measurements: Measurements;
  additionalNotes: string;
  totalPrice: number;
  advancePayment: number;
  remainingAmount: number; // derived or persisted
  deliveryDate: string; // "YYYY-MM-DD"
  status: OrderStatus;
  createdAt: string;
  completedAt?: string; // "YYYY-MM-DD"
}

export interface ShopAccount {
  id: string;
  shopName: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  password?: string;
  status: 'Active' | 'Suspended' | 'Pending Approval' | 'Expired';
  plan: 'Free Trial' | 'Monthly Plan' | 'Lifetime Plan';
  expiryDate?: string; // "YYYY-MM-DD"
  createdAt: string;
  brandingSetupDone?: boolean;
  shopLogo?: string; // base64 data url
  deviceId?: string; // Device ID for locking
}

