import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, LogOut, LayoutDashboard, PlusCircle, Search, 
  HelpCircle, UserCircle, BookOpen, AlertCircle, Database, History as HistoryIcon,
  Sparkles, CreditCard, Calendar
} from 'lucide-react';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CustomerForm from './components/CustomerForm';
import CustomerProfile from './components/CustomerProfile';
import SearchHeader from './components/SearchHeader';
import History from './components/History';
import AdminDashboard from './components/AdminDashboard';
import Subscription from './components/Subscription';
import BrandingSetup from './components/BrandingSetup';

// Database Service
import { 
  getCustomers, addCustomer, updateCustomer, deleteCustomer,
  getAuthUser, loginUser, logoutUser, getShops, updateShop 
} from './db';
import { Customer, OrderStatus, ShopAccount } from './types';

// Helper to render shop logos
function renderShopLogo(logo: string | undefined, shopName: string, sizeClass = "w-8 h-8 text-xs") {
  if (!logo) {
    return (
      <div className={`${sizeClass} bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center font-bold uppercase shadow-sm shrink-0`}>
        {shopName ? shopName.substring(0, 2).toUpperCase() : 'DL'}
      </div>
    );
  }

  if (logo.startsWith('PRESET:')) {
    const parts = logo.split(':');
    const iconType = parts[1];
    const colorClass = parts[2] || 'bg-emerald-800 text-amber-300 border-amber-300';
    return (
      <div className={`${sizeClass} rounded-lg flex items-center justify-center border font-bold shadow-sm shrink-0 ${colorClass}`}>
        {iconType === 'logo-scissors' && <Scissors className="w-4 h-4 rotate-90" />}
        {iconType === 'logo-crown' && <span className="text-sm">👑</span>}
        {iconType === 'logo-suit' && <span className="text-sm">👔</span>}
        {iconType === 'logo-needle' && <span className="text-sm">🪡</span>}
      </div>
    );
  }

  return (
    <img 
      src={logo} 
      alt={shopName} 
      referrerPolicy="no-referrer"
      className={`${sizeClass} rounded-lg object-cover border border-amber-400/50 shadow-sm shrink-0`}
    />
  );
}

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'add' | 'edit' | 'profile' | 'history' | 'subscription' | 'branding'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [currentShop, setCurrentShop] = useState<ShopAccount | null>(null);
  const [reorderCustomer, setReorderCustomer] = useState<Customer | null>(null);

  // Sync tab title with the custom shop name
  useEffect(() => {
    if (currentShop) {
      document.title = `${currentShop.shopName} - Digital Tailoring Register`;
    } else {
      document.title = 'Darzi Ledger - Digital Tailoring Register';
    }
  }, [currentShop]);

  // Load user, current shop, and customers on mount
  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
      setCustomers(getCustomers(authUser));
      
      // Load shop account details
      const shops = getShops();
      const shop = shops.find(s => s.email.toLowerCase() === authUser.toLowerCase());
      if (shop) {
        setCurrentShop(shop);
      }
    }
  }, [view]);

  // Sync state with local storage
  const refreshCustomers = (currentEmail?: string) => {
    const activeEmail = currentEmail || user;
    if (activeEmail) {
      setCustomers(getCustomers(activeEmail));
    }
  };

  const handleLoginSuccess = (email: string) => {
    loginUser(email);
    setUser(email);
    
    // Find active shop
    const shops = getShops();
    const shop = shops.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (shop) {
      setCurrentShop(shop);
    }
    
    setView('dashboard');
    refreshCustomers(email);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentShop(null);
    setSelectedCustomerId(null);
    setView('dashboard');
  };

  const handleCreateCustomer = (data: Omit<Customer, 'id' | 'createdAt' | 'remainingAmount'>) => {
    const newCust = addCustomer({
      ...data,
      shopEmail: user || undefined
    });
    refreshCustomers();
    setReorderCustomer(null);
    setSelectedCustomerId(newCust.id);
    setView('profile');
  };

  const handleUpdateCustomer = (data: Omit<Customer, 'id' | 'createdAt' | 'remainingAmount'>) => {
    if (!selectedCustomerId) return;
    updateCustomer(selectedCustomerId, data);
    refreshCustomers();
    setView('profile');
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    refreshCustomers();
    setSelectedCustomerId(null);
    setView('dashboard');
  };

  const handleCompleteCustomer = (id: string) => {
    updateCustomer(id, {
      status: OrderStatus.COMPLETED,
      completedAt: new Date().toISOString().split('T')[0]
    });
    refreshCustomers();
    setView('history');
    setSelectedCustomerId(null);
  };

  const handleCustomerClick = (id: string) => {
    setSelectedCustomerId(id);
    setView('profile');
  };

  const handleSelectSearchedCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setView('profile');
  };

  const handleEditClickFromProfile = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setView('edit');
  };

  const getDaysRemaining = (expiryDateStr?: string) => {
    if (!expiryDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // If not authenticated, force login screen
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // If Super Admin, direct to the administrative workstation
  if (user === 'Huzaifa') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // If account is expired or suspended, block full dashboard access
  if (currentShop && (currentShop.status === 'Expired' || currentShop.status === 'Suspended')) {
    const handleContactWhatsApp = () => {
      const textMessage = `Assalam-o-Alaikum Huzaifa! My Darzi Ledger account status is currently "${currentShop.status}". I need assistance to reactivate/renew my plan.\n\nShop Name: ${currentShop.shopName}\nEmail: ${currentShop.email}`;
      const encoded = encodeURIComponent(textMessage);
      window.open(`https://wa.me/923011163300?text=${encoded}`, '_blank');
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4" id="app-blocked-screen">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
              Access Blocked
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Account Status: {currentShop.status}
            </h2>
            <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed">
              {currentShop.status === 'Expired' ? (
                "Your 3-day free trial has expired. Please contact admin to activate a plan."
              ) : (
                "Your account has been suspended. Please contact admin to reactivate your access."
              )}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <p className="font-semibold text-slate-700">Admin Support Contact</p>
            <p className="text-slate-500">Name: <span className="font-bold">Huzaifa</span></p>
            <p className="text-slate-500">WhatsApp: <span className="font-bold">0301 1163300</span></p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleContactWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-display font-semibold text-xs py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>Contact Admin</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              Sign Out & Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If first-time customer login, force branding setup
  if (currentShop && !currentShop.brandingSetupDone) {
    const handleBrandingSave = (brandingData: { shopName: string; fullName: string; shopLogo: string }) => {
      const updated = updateShop(currentShop.id, {
        shopName: brandingData.shopName,
        fullName: brandingData.fullName,
        shopLogo: brandingData.shopLogo,
        brandingSetupDone: true
      });
      setCurrentShop(updated);
    };
    return <BrandingSetup currentShop={currentShop} onSave={handleBrandingSave} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-root">
      {/* Top Professional Navigation Bar */}
      <header className="sticky top-0 bg-emerald-900 text-white shadow-md z-40 border-b border-emerald-800" id="main-header">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between" id="header-inner">
          {/* Logo Brand */}
          <div 
            onClick={() => { setView('dashboard'); setSelectedCustomerId(null); }}
            className="flex items-center gap-2.5 cursor-pointer select-none active:opacity-90"
            id="header-brand"
          >
            {currentShop && currentShop.shopLogo ? (
              renderShopLogo(currentShop.shopLogo, currentShop.shopName, "w-8 h-8 text-xs")
            ) : (
              <div className="p-1.5 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center">
                <Scissors className="w-4 h-4 rotate-90 stroke-[2.5]" />
              </div>
            )}
            <div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight">
                {currentShop ? currentShop.shopName : 'Darzi Ledger'}
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800 text-amber-300 font-bold px-1.5 py-0.5 rounded ml-2 uppercase tracking-wide">Digital Book</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5" id="header-controls">
            {/* Subscription Button */}
            <button
              onClick={() => { setView('subscription'); setSelectedCustomerId(null); }}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold font-display transition-all border active:scale-95 ${
                view === 'subscription'
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                  : 'bg-emerald-950/45 text-emerald-100 hover:bg-emerald-950/80 border-emerald-800'
              }`}
              id="nav-subscription-btn"
              title="Buy Subscription"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Premium</span>
            </button>

            {/* History Link */}
            <button
              onClick={() => { setView('history'); setSelectedCustomerId(null); }}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold font-display transition-all border active:scale-95 ${
                view === 'history'
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                  : 'bg-emerald-950/45 text-emerald-100 hover:bg-emerald-950/80 border-emerald-800'
              }`}
              id="nav-history-btn"
              title="View History"
            >
              <HistoryIcon className="w-3.5 h-3.5" />
              <span>History</span>
            </button>

            {/* User Details Badge (Clickable Branding settings trigger) */}
            <button
              onClick={() => { setView('branding'); setSelectedCustomerId(null); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-display transition-all border active:scale-95 max-w-[150px] truncate ${
                view === 'branding'
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                  : 'bg-emerald-950/45 text-emerald-100 hover:bg-emerald-950/80 border-emerald-800'
              }`}
              id="nav-branding-btn"
              title="Edit Shop Branding"
            >
              {currentShop && currentShop.shopLogo ? (
                renderShopLogo(currentShop.shopLogo, currentShop.shopName, "w-5 h-5 text-[9px]")
              ) : (
                <UserCircle className="w-4 h-4 text-emerald-300" />
              )}
              <span className="hidden xs:inline">{currentShop ? currentShop.shopName : user}</span>
            </button>

            {/* Logout Trigger */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-950/80 text-amber-300 text-xs font-semibold font-display px-2.5 py-2 rounded-xl transition-all border border-emerald-800 active:scale-95"
              id="logout-btn"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-6" id="main-content-area">
        
        {/* Subscription Monitoring Dashboard Banner */}
        {view === 'dashboard' && currentShop && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="dashboard-sub-monitoring">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                <Sparkles className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider">Subscription Status</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    currentShop.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    currentShop.status === 'Expired' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {currentShop.status}
                  </span>
                </div>
                <div className="text-xxs text-slate-500 mt-1 font-medium space-y-0.5">
                  <p>
                    Current Plan: <span className="text-slate-800 font-bold">{currentShop.plan}</span>
                  </p>
                  {(currentShop.plan === 'Free Trial' || currentShop.plan === 'Monthly Plan') && (
                    <p className="text-amber-700 font-bold flex items-center gap-1">
                      <span>🕒 Days Remaining:</span>
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono text-xs font-bold">
                        {getDaysRemaining(currentShop.expiryDate)} Days
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto" id="dashboard-monitoring-actions">
              <button
                onClick={() => setView('branding')}
                className="text-xxs font-bold text-blue-800 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 py-2 text-center transition-all"
              >
                Edit Shop Branding
              </button>
              <button
                onClick={() => setView('subscription')}
                className="text-xxs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-4 py-2 text-center transition-all"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Persistent Search Bar displayed ONLY on Dashboard or Profile page for super-fast lookups */}
        {view === 'dashboard' && (
          <div className="space-y-2" id="dashboard-search-container">
            <SearchHeader 
              customers={customers.filter(c => c.status !== OrderStatus.COMPLETED)} 
              onSelectCustomer={handleSelectSearchedCustomer} 
            />
          </div>
        )}

        {/* Dynamic Route/View Switcher */}
        <div className="flex-1" id="view-router-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (selectedCustomerId || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'dashboard' && (
                <Dashboard 
                  customers={customers}
                  onAddCustomerClick={() => setView('add')}
                  onCustomerClick={handleCustomerClick}
                  onSearchClick={() => {
                    const input = document.getElementById('search-customer-input');
                    if (input) input.focus();
                  }}
                />
              )}

              {view === 'history' && (
                <History 
                  customers={customers}
                  onCustomerClick={handleCustomerClick}
                  onBackClick={() => setView('dashboard')}
                />
              )}

              {view === 'subscription' && currentShop && (
                <Subscription 
                  currentShop={currentShop}
                  onBackClick={() => setView('dashboard')}
                />
              )}

              {view === 'branding' && currentShop && (
                <BrandingSetup 
                  currentShop={currentShop}
                  onSave={(brandingData) => {
                    const updated = updateShop(currentShop.id, {
                      shopName: brandingData.shopName,
                      fullName: brandingData.fullName,
                      shopLogo: brandingData.shopLogo,
                      brandingSetupDone: true
                    });
                    setCurrentShop(updated);
                    setView('dashboard');
                  }}
                  onCancel={() => setView('dashboard')}
                />
              )}

              {view === 'add' && (
                <CustomerForm 
                  initialCustomer={reorderCustomer || undefined}
                  isReorder={!!reorderCustomer}
                  onSave={handleCreateCustomer}
                  onCancel={() => {
                    if (reorderCustomer) {
                      setSelectedCustomerId(reorderCustomer.id);
                      setView('profile');
                      setReorderCustomer(null);
                    } else {
                      setView('dashboard');
                    }
                  }}
                />
              )}

              {view === 'edit' && selectedCustomer && (
                <CustomerForm 
                  initialCustomer={selectedCustomer}
                  onSave={handleUpdateCustomer}
                  onCancel={() => setView('profile')}
                />
              )}

              {view === 'profile' && selectedCustomer && (
                <CustomerProfile 
                  customer={selectedCustomer}
                  allCustomers={customers}
                  onEditClick={handleEditClickFromProfile}
                  onDeleteClick={handleDeleteCustomer}
                  onCompleteClick={handleCompleteCustomer}
                  onReorderClick={(cust) => {
                    setReorderCustomer(cust);
                    setView('add');
                  }}
                  onViewOrderClick={(id) => {
                    setSelectedCustomerId(id);
                  }}
                  onBackClick={() => { 
                    setView(selectedCustomer.status === OrderStatus.COMPLETED ? 'history' : 'dashboard'); 
                    setSelectedCustomerId(null); 
                  }}
                />
              )}

              {view === 'profile' && !selectedCustomer && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center gap-3">
                  <AlertCircle className="w-12 h-12 text-slate-300" />
                  <h3 className="font-display font-bold text-slate-800 text-lg">Customer Not Found</h3>
                  <p className="text-xs text-slate-500">The customer record you are trying to view does not exist or has been deleted.</p>
                  <button 
                    onClick={() => setView('dashboard')}
                    className="mt-2 bg-emerald-800 text-amber-300 font-display text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer information */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-400 select-none flex items-center justify-center gap-2" id="main-footer">
        <span>{currentShop ? currentShop.shopName : 'Darzi Ledger'} • Digital Tailoring Register</span>
      </footer>
    </div>
  );
}
