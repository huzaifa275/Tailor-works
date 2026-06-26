import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Clock, Coins, Phone, Calendar, ArrowLeft, 
  CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle
} from 'lucide-react';
import { ShopAccount } from '../types';

interface SubscriptionProps {
  currentShop: ShopAccount;
  onBackClick?: () => void;
}

export default function Subscription({ currentShop, onBackClick }: SubscriptionProps) {
  // Direct helper to contact Huzaifa on WhatsApp
  const handleContactWhatsApp = (planName: string) => {
    const textMessage = `Assalam-o-Alaikum Huzaifa! I am looking to purchase/renew the "${planName}" for my shop "${currentShop.shopName}".\n\nRegistered Email: ${currentShop.email}\nMobile: ${currentShop.mobileNumber || 'N/A'}`;
    const encoded = encodeURIComponent(textMessage);
    window.open(`https://wa.me/923011163300?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6" id="subscription-root">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="subscription-header">
        <div className="flex items-center gap-3">
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900 active:scale-95 border border-transparent hover:border-slate-200/50"
              id="sub-back-btn"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Buy Subscription</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Activate or renew premium licensing packages for your digital darzi ledger
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border w-fit shrink-0 ${
          currentShop.status === 'Active' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
            : 'bg-rose-50 text-rose-800 border-rose-100'
        }`}>
          Status: {currentShop.status}
        </span>
      </div>

      {/* Subscription Monitoring Widget (Dashboard Info Panel) */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-800 relative overflow-hidden" id="sub-monitoring-banner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Your Current Registration Status</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold">{currentShop.shopName}</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 pt-2">
              <div>
                <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Current Plan</p>
                <p className="text-sm font-semibold text-white mt-0.5">{currentShop.plan}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Account Status</p>
                <p className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${currentShop.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                  {currentShop.status}
                </p>
              </div>

              {currentShop.plan === 'Monthly Plan' && currentShop.expiryDate && (
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Expiry Date</p>
                  <p className="text-sm font-semibold text-amber-300 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{new Date(currentShop.expiryDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-800/60 p-4 rounded-2xl shrink-0 space-y-1 text-center" id="owner-info">
            <p className="text-xxs text-emerald-200 font-bold uppercase">Registered Owner</p>
            <p className="text-sm font-bold text-amber-300">{currentShop.fullName}</p>
            <p className="text-xxs font-mono text-emerald-300/80 mt-0.5">{currentShop.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription Plans Side-by-Side (Buy Subscription) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sub-packages-grid">
        {/* Plan 1: Monthly Plan */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden" id="plan-monthly-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 w-fit">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xxs font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Popular Monthly License
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 font-display">Monthly Subscription</h3>
              <p className="text-xs text-slate-500 mt-1">Perfect for growing boutique registers wanting low upfront operational costs</p>
            </div>

            {/* Price tag */}
            <div className="py-2">
              <p className="text-2xl font-bold font-display text-slate-900">
                Rs. 1,500 <span className="text-xs font-normal text-slate-400 font-sans">/ month</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Recurring digital service fee billed monthly</p>
            </div>

            {/* Features check list */}
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-50 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complete Customer Measurement Ledger</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated Order Status Logging & Archives</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Offline local client persistent caching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cancel any time without penalties</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleContactWhatsApp('Monthly Subscription Plan')}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98]"
            id="buy-monthly-btn"
          >
            <Phone className="w-4 h-4" />
            <span>Contact Admin to Purchase</span>
          </button>
        </div>

        {/* Plan 2: Lifetime Plan */}
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden" id="plan-lifetime-card">
          <div className="absolute top-0 right-0 bg-amber-400 text-emerald-950 text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl font-display">
            Best Value Lifetime
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 w-fit">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 font-display">Lifetime Subscription</h3>
              <p className="text-xs text-slate-500 mt-1">One-time payment for premium business owners who want zero recurring stress</p>
            </div>

            {/* Price tag */}
            <div className="py-2">
              <p className="text-2xl font-bold font-display text-slate-900">
                Rs. 12,000 <span className="text-xs font-normal text-slate-400 font-sans">one-time</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Pay once, use forever. No monthly bills, ever.</p>
            </div>

            {/* Features check list */}
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-50 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-700">All standard ledger and archives access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Unrestricted customers and dress listings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Priority Super Admin direct support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-700 font-semibold">Zero monthly renewals or expiry worries</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleContactWhatsApp('Lifetime Subscription Plan')}
            className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-display font-semibold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
            id="buy-lifetime-btn"
          >
            <Phone className="w-4 h-4" />
            <span>Contact Admin to Purchase</span>
          </button>
        </div>
      </div>

      {/* Automatic Expiry Lock Reminder notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800" id="sub-reminder-notice">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold">Subscription Lock Policy</h4>
          <p className="leading-relaxed">
            When a Monthly Plan expires, your shop register is temporarily locked to preserve database integrity. 
            All customer measurements and balance dues remain <strong>securely saved</strong> in your database and are <strong>unaffected</strong>. 
            Full access is immediately restored upon renewal of your plan.
          </p>
        </div>
      </div>
    </div>
  );
}
