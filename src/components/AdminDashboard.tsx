import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, UserCheck, UserMinus, PlusCircle, Trash2, Edit, Search, 
  Coins, Clock, Power, ShieldAlert, CheckCircle2, AlertTriangle, 
  Settings, KeyRound, Mail, Calendar, Sparkles, LogOut, Phone, User,
  RefreshCw
} from 'lucide-react';
import { ShopAccount } from '../types';
import { getShops, addShop, updateShop, deleteShop } from '../db';

// Helper to render shop logo on the admin dashboard
function renderAdminShopLogo(logo: string | undefined, shopName: string, status: string) {
  const baseBg = status === 'Suspended' ? 'bg-rose-100 text-rose-700 border-rose-200' : 
                 status === 'Pending Approval' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                 'bg-slate-100 text-slate-600 border-slate-200';

  if (!logo) {
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs uppercase border shadow-sm shrink-0 ${baseBg}`}>
        {shopName ? shopName.substring(0, 2).toUpperCase() : 'DL'}
      </div>
    );
  }

  if (logo.startsWith('PRESET:')) {
    const parts = logo.split(':');
    const iconType = parts[1];
    const colorClass = parts[2] || 'bg-emerald-800 text-amber-300 border-amber-300';
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-xs shadow-sm shrink-0 ${colorClass}`}>
        {iconType === 'logo-scissors' && '✂️'}
        {iconType === 'logo-crown' && '👑'}
        {iconType === 'logo-suit' && '👔'}
        {iconType === 'logo-needle' && '🪡'}
      </div>
    );
  }

  return (
    <img 
      src={logo} 
      alt={shopName} 
      referrerPolicy="no-referrer"
      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
    />
  );
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [shops, setShops] = useState<ShopAccount[]>(getShops());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopAccount | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // New/Edit shop input states
  const [shopName, setShopName] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('darzi123');
  const [plan, setPlan] = useState<'Free Trial' | 'Monthly Plan' | 'Lifetime Plan'>('Free Trial');
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'Pending Approval' | 'Expired'>('Active');
  const [expiryDate, setExpiryDate] = useState(''); // YYYY-MM-DD
  
  const [error, setError] = useState<string | null>(null);

  // Refresh shops from DB helper
  const refreshShops = () => {
    setShops(getShops());
  };

  // Stats Calculations
  const totalShops = shops.length;
  const activeShops = shops.filter(s => s.status === 'Active').length;
  const pendingShops = shops.filter(s => s.status === 'Pending Approval').length;
  const expiredShops = shops.filter(s => s.status === 'Expired').length;
  const suspendedShops = shops.filter(s => s.status === 'Suspended').length;
  
  const freeTrialCount = shops.filter(s => s.plan === 'Free Trial').length;
  const monthlyCount = shops.filter(s => s.plan === 'Monthly Plan').length;
  const lifetimeCount = shops.filter(s => s.plan === 'Lifetime Plan').length;

  // Search filter
  const filteredShops = shops.filter(s => 
    s.shopName.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    s.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Handle Add Shop Open
  const handleOpenAddModal = () => {
    setShopName('');
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setPassword('darzi123');
    setPlan('Free Trial');
    setStatus('Active');
    
    // Set a default expiry date (30 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setExpiryDate(futureDate.toISOString().split('T')[0]);
    
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleCreateShop = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!shopName.trim() || !fullName.trim() || !mobileNumber.trim() || !email.trim()) {
      setError('All fields except password are required.');
      return;
    }

    // Check if email already exists
    const emailExists = shops.some(s => s.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      setError('A shop account with this email address already exists.');
      return;
    }

    addShop({
      shopName: shopName.trim(),
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      password,
      status,
      plan,
      expiryDate: plan === 'Monthly Plan' ? expiryDate : undefined
    });

    setIsAddModalOpen(false);
    refreshShops();
  };

  // Handle Edit Shop Open
  const handleOpenEditModal = (shop: ShopAccount) => {
    setEditingShop(shop);
    setShopName(shop.shopName);
    setFullName(shop.fullName || '');
    setMobileNumber(shop.mobileNumber || '');
    setEmail(shop.email);
    setPassword(shop.password || 'darzi123');
    setPlan(shop.plan);
    setStatus(shop.status);
    
    if (shop.expiryDate) {
      setExpiryDate(shop.expiryDate);
    } else {
      const defaultExp = new Date();
      defaultExp.setDate(defaultExp.getDate() + 30);
      setExpiryDate(defaultExp.toISOString().split('T')[0]);
    }
    
    setError(null);
  };

  const handleUpdateShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop) return;
    setError(null);

    if (!shopName.trim() || !fullName.trim() || !mobileNumber.trim() || !email.trim()) {
      setError('Required fields cannot be empty.');
      return;
    }

    // Check duplicate email except current
    const emailExists = shops.some(s => s.id !== editingShop.id && s.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      setError('Another shop is already registered with this email.');
      return;
    }

    updateShop(editingShop.id, {
      shopName: shopName.trim(),
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      password,
      status,
      plan,
      expiryDate: plan === 'Monthly Plan' ? expiryDate : undefined
    });

    setEditingShop(null);
    refreshShops();
  };

  // Fast direct action to Toggle status / Plan directly
  const handleToggleStatus = (shop: ShopAccount) => {
    const newStatus = shop.status === 'Active' ? 'Suspended' : 'Active';
    updateShop(shop.id, { status: newStatus });
    refreshShops();
  };

  const handleSetPlan = (shop: ShopAccount, newPlan: 'Free Trial' | 'Monthly Plan' | 'Lifetime Plan') => {
    const fields: Partial<ShopAccount> = { plan: newPlan };
    
    if (newPlan === 'Monthly Plan') {
      // Auto assign 30 days expiration
      const exp = new Date();
      exp.setDate(exp.getDate() + 30);
      fields.expiryDate = exp.toISOString().split('T')[0];
    } else {
      fields.expiryDate = undefined;
    }
    
    updateShop(shop.id, fields);
    refreshShops();
  };

  // Quick Action to Activate or Renew a plan
  const handleQuickActivate = (shop: ShopAccount, planType: 'Monthly Plan' | 'Lifetime Plan') => {
    const exp = new Date();
    exp.setDate(exp.getDate() + 30);
    const updatedFields: Partial<ShopAccount> = {
      plan: planType,
      status: 'Active',
      expiryDate: planType === 'Monthly Plan' ? exp.toISOString().split('T')[0] : undefined
    };
    updateShop(shop.id, updatedFields);
    refreshShops();
  };

  // Delete Shop handler
  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      deleteShop(confirmDeleteId);
      setConfirmDeleteId(null);
      refreshShops();
    }
  };

  // Reset Branding handler
  const handleResetBranding = (shopId: string) => {
    updateShop(shopId, {
      brandingSetupDone: false,
      shopLogo: undefined
    });
    refreshShops();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="admin-root">
      {/* Super Admin Top Header Navigation */}
      <header className="bg-emerald-900 border-b border-emerald-800 text-white shadow-md sticky top-0 z-30" id="admin-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-emerald-950 rounded-xl shadow-inner border border-amber-300 flex items-center justify-center">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold font-display tracking-tight text-white leading-none">Darzi Ledger Admin</h1>
                <span className="bg-amber-400 text-emerald-950 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xxs text-emerald-200">Logged in as: <span className="font-semibold text-amber-300">Huzaifa</span></p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-950 hover:bg-red-950/80 hover:text-red-200 transition-all text-emerald-200 px-3 py-2 rounded-xl border border-emerald-800"
            id="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8" id="admin-main">
        {/* Welcome Banner */}
        <div className="bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-emerald-700 flex flex-col md:flex-row md:items-center justify-between gap-6" id="admin-welcome-banner">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-950/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Master Administration Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">Assalam-o-Alaikum, Huzaifa!</h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Activate Monthly / Lifetime Plans, suspend/reactivate registers, set precise monthly expiry dates, and review pending registrations.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-display font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md active:scale-95 border border-amber-300 shrink-0 self-start md:self-auto relative z-10"
            id="admin-add-shop-btn"
          >
            <PlusCircle className="w-5 h-5 text-emerald-950" />
            <span>Register New Shop</span>
          </button>
        </div>

        {/* Dashboard Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats-grid">
          {/* Stat 1: Total Shops */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3.5" id="admin-stat-total">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Total Registers</p>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-800 leading-none mt-1">{totalShops}</h3>
            </div>
          </div>

          {/* Stat 2: Active & Pending */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3.5" id="admin-stat-status">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Active / Pending</p>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-800 mt-1 leading-none">
                <span className="text-emerald-700">{activeShops}</span>
                <span className="text-slate-300 px-1">/</span>
                <span className="text-amber-500">{pendingShops}</span>
              </h3>
            </div>
          </div>

          {/* Stat 3: Expired & Suspended */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3.5" id="admin-stat-expired">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Expired / Suspended</p>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-800 mt-1 leading-none">
                <span className="text-rose-500">{expiredShops}</span>
                <span className="text-slate-300 px-1">/</span>
                <span className="text-rose-700">{suspendedShops}</span>
              </h3>
            </div>
          </div>

          {/* Stat 4: Revenue & Plans */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3.5" id="admin-stat-plans">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Plan Subscriptions</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Monthly: <span className="font-bold text-blue-700">{monthlyCount}</span> • Life: <span className="font-bold text-amber-600">{lifetimeCount}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Master Registry Table / Grid */}
        <div className="space-y-4" id="admin-registry-section">
          {/* Section Header and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="admin-search-bar">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-800">Tailoring Shops Ledger Directory</h3>
              <p className="text-xs text-slate-500">Search by Shop Name, Manager Name, Mobile Number, or Email</p>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-emerald-800" />
              </div>
              <input
                type="text"
                placeholder="Search shops, owners, phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/5 transition-all"
              />
            </div>
          </div>

          {/* Shops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="admin-shops-grid">
            {filteredShops.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Store className="w-12 h-12 stroke-[1.2] text-slate-300" />
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm">No tailor shop registers matched search criteria</h4>
                  <p className="text-xs text-slate-400 mt-1">Try typing a different name or add a new boutique register to the system.</p>
                </div>
              </div>
            ) : (
              filteredShops.map((shop) => (
                <div 
                  key={shop.id} 
                  className={`bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    shop.status === 'Suspended' ? 'border-rose-100 bg-rose-50/5' : 
                    shop.status === 'Pending Approval' ? 'border-amber-200 bg-amber-50/5' : 'border-slate-100'
                  }`}
                  id={`admin-shop-card-${shop.id}`}
                >
                  {/* Shop Card Header */}
                  <div className="p-5 border-b border-slate-50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {renderAdminShopLogo(shop.shopLogo, shop.shopName, shop.status)}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display font-bold text-slate-800 text-sm leading-tight">{shop.shopName}</h4>
                            {shop.brandingSetupDone && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase font-display" title="Custom Branding Configured">
                                Brand
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{shop.email}</span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        shop.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                        shop.status === 'Pending Approval' ? 'bg-amber-50 text-amber-800 border-amber-100' :
                        shop.status === 'Expired' ? 'bg-rose-50 text-rose-800 border-rose-100' :
                        'bg-red-50 text-red-800 border-red-100'
                      }`}>
                        {shop.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{shop.fullName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{shop.mobileNumber || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-[10px] truncate max-w-[200px]" title={shop.deviceId || 'No device registered'}>
                          Device ID: {shop.deviceId ? (
                            <span className="text-emerald-700 font-bold">{shop.deviceId.substring(0, 15)}...</span>
                          ) : (
                            <span className="text-slate-400 italic">No device registered</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-x-2 pt-2 text-[10px] text-slate-400 border-t border-slate-50 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined: {new Date(shop.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </span>
                      {shop.password && (
                        <span>PW: {shop.password}</span>
                      )}
                    </div>
                  </div>

                  {/* Licensing Actions (Activations) */}
                  <div className="p-4 bg-slate-50/50 border-b border-slate-50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Plan: <span className="text-slate-700 font-bold">{shop.plan}</span></p>
                      {shop.expiryDate && shop.plan === 'Monthly Plan' && (
                        <span className="text-[10px] font-bold text-amber-700 font-mono">Expires: {shop.expiryDate}</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Activate/Renew Monthly Plan Button */}
                      <button
                        onClick={() => handleSetPlan(shop, 'Monthly Plan')}
                        className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border ${
                          shop.plan === 'Monthly Plan'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-blue-700 border-slate-200/60'
                        }`}
                        title="Set to Monthly Plan"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Monthly Plan</span>
                      </button>

                      {/* Activate/Renew Lifetime Plan Button */}
                      <button
                        onClick={() => handleSetPlan(shop, 'Lifetime Plan')}
                        className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border ${
                          shop.plan === 'Lifetime Plan'
                            ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-amber-800 border-slate-200/60'
                        }`}
                        title="Set to Lifetime Plan"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Lifetime Plan</span>
                      </button>
                    </div>

                    {/* Quick Activations for Pending/Expired Shops */}
                    {(shop.status === 'Pending Approval' || shop.status === 'Expired') && (
                      <div className="bg-white p-2 rounded-xl border border-slate-200/60 flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-amber-600 uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Needs Activation / Payment Confirmation</span>
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleQuickActivate(shop, 'Monthly Plan')}
                            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-1 px-2 rounded text-[10px] transition-all"
                          >
                            Activate Monthly
                          </button>
                          <button
                            onClick={() => handleQuickActivate(shop, 'Lifetime Plan')}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-1 px-2 rounded text-[10px] transition-all"
                          >
                            Activate Lifetime
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Block / Action Utilities Footer */}
                  <div className="p-4 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Suspend / Reactivate Switch */}
                      <button
                        onClick={() => handleToggleStatus(shop)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
                          shop.status === 'Suspended'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{shop.status === 'Suspended' ? 'Reactivate' : 'Suspend'}</span>
                      </button>

                      {/* Status indicator badge */}
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        shop.status === 'Suspended' ? 'bg-red-500 animate-pulse' :
                        shop.status === 'Pending Approval' ? 'bg-amber-400 animate-pulse' :
                        shop.status === 'Expired' ? 'bg-orange-500' : 'bg-emerald-500'
                      }`} title={shop.status}></span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Reset Brand (Only visible if branding is configured) */}
                      {shop.brandingSetupDone && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to reset the branding of ${shop.shopName}? This will clear their custom logo and reset setup progress.`)) {
                              handleResetBranding(shop.id);
                            }
                          }}
                          className="p-2 hover:bg-amber-100 hover:text-amber-700 rounded-xl text-slate-400 transition-all active:scale-90"
                          title="Reset Shop Branding & Logo"
                        >
                          <RefreshCw className="w-4 h-4 animate-spin-hover" />
                        </button>
                      )}

                      {/* Reset Device Lock (Only visible if locked to a device) */}
                      {shop.deviceId && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to reset the device lock for ${shop.shopName}? This allows them to log in on a new device.`)) {
                              updateShop(shop.id, { deviceId: undefined });
                              refreshShops();
                            }
                          }}
                          className="p-2 hover:bg-blue-100 hover:text-blue-700 rounded-xl text-slate-400 transition-all active:scale-90"
                          title="Reset Device Lock"
                        >
                          <KeyRound className="w-4 h-4 text-blue-600" />
                        </button>
                      )}

                      {/* Edit Details */}
                      <button
                        onClick={() => handleOpenEditModal(shop)}
                        className="p-2 hover:bg-slate-200/80 hover:text-slate-900 rounded-xl text-slate-500 transition-all active:scale-90 border border-transparent hover:border-slate-300/30"
                        title="Edit Shop Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete shop */}
                      <button
                        onClick={() => setConfirmDeleteId(shop.id)}
                        className="p-2 hover:bg-rose-100 hover:text-rose-700 rounded-xl text-slate-400 transition-all active:scale-90"
                        title="Delete Shop Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add New Shop Registry Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="add-shop-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
              id="add-shop-modal"
            >
              <div className="bg-emerald-800 p-5 text-white flex items-center gap-2 border-b border-emerald-950">
                <Store className="w-5 h-5 text-amber-300" />
                <h3 className="font-display font-bold text-base text-white">Register New Tailoring Shop</h3>
              </div>

              <form onSubmit={handleCreateShop} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Boutique / Shop Name</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Al-Noor Royal Tailors"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Manager / Owner Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mohammad Bilal"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Owner Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 03001234567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Manager Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@shop.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Access Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access security key"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-mono text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Default Plan Type</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    >
                      <option value="Free Trial">Free Trial</option>
                      <option value="Monthly Plan">Monthly Plan</option>
                      <option value="Lifetime Plan">Lifetime Plan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Initial Account Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Expired">Expired</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {plan === 'Monthly Plan' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 text-blue-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Set Expiry Date (YYYY-MM-DD)</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-700 transition-all"
                    />
                  </motion.div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-display font-semibold text-xs rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-display font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Create Register
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Existing Shop Registry Modal */}
        {editingShop && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="edit-shop-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
              id="edit-shop-modal"
            >
              <div className="bg-emerald-800 p-5 text-white flex items-center gap-2 border-b border-emerald-950">
                <Edit className="w-5 h-5 text-amber-300" />
                <h3 className="font-display font-bold text-base text-white">Modify Tailor Shop Register</h3>
              </div>

              <form onSubmit={handleUpdateShop} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Boutique / Shop Name</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Owner / Manager Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Owner Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Manager Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Access Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-mono text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">License Plan</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    >
                      <option value="Free Trial">Free Trial</option>
                      <option value="Monthly Plan">Monthly Plan</option>
                      <option value="Lifetime Plan">Lifetime Plan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1">Account Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-700 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Expired">Expired</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {plan === 'Monthly Plan' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1 text-blue-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Set Expiry Date (YYYY-MM-DD)</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-700 transition-all"
                    />
                  </motion.div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingShop(null)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-display font-semibold text-xs rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-display font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="delete-shop-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center"
              id="delete-shop-modal"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Remove Shop Register?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to permanently delete this shop account? All associated measurements, billing ledgers, and configurations will be irreversibly erased from the system database.
              </p>
              
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-display text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white transition-all font-display text-xs font-semibold rounded-xl shadow-md active:scale-95"
                >
                  Delete Shop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
