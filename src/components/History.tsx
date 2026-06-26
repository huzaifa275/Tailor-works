import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, History as HistoryIcon, Calendar, CheckCircle2, ArrowLeft, Phone, ArrowRight, User, CircleDollarSign } from 'lucide-react';
import { Customer, OrderStatus } from '../types';

interface HistoryProps {
  customers: Customer[];
  onCustomerClick: (id: string) => void;
  onBackClick: () => void;
}

export default function History({ customers, onCustomerClick, onBackClick }: HistoryProps) {
  const [query, setQuery] = useState('');

  // Only display completed orders in History
  const completedCustomers = customers.filter(c => c.status === OrderStatus.COMPLETED);

  // Filter completed customers based on query
  const filteredHistory = completedCustomers.filter(
    c => c.name.toLowerCase().includes(query.toLowerCase().trim()) || 
         c.mobile.includes(query.trim())
  );

  return (
    <div className="space-y-6" id="history-root">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="history-header">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900 active:scale-95 border border-transparent hover:border-slate-200/50"
            id="history-back-btn"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-emerald-800" />
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Tailoring History</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Completed outfits and archived client ledger registers
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit shrink-0">
          {completedCustomers.length} Records Completed
        </span>
      </div>

      {/* History Search Bar */}
      <div className="relative flex items-center" id="history-search-wrapper">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-emerald-800" />
        </div>
        <input
          id="history-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search history by customer name or mobile number..."
          className="w-full bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-10 text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/5 text-sm custom-shadow"
        />
      </div>

      {/* History Records List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="history-records-card">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2" id="no-history-records">
            <HistoryIcon className="w-10 h-10 stroke-[1.2] text-slate-300 animate-spin-slow" />
            <span className="font-semibold text-slate-600 mt-2">
              {query.trim() ? 'No matching history records found' : 'No completed orders yet'}
            </span>
            <span className="text-xs text-slate-400 max-w-xs">
              {query.trim() 
                ? 'Try searching with a different client name or mobile number.' 
                : 'Active customer orders marked as completed will automatically appear in this ledger.'}
            </span>
          </div>
        ) : (
          <div className="divide-y divide-slate-50" id="history-records-list">
            <div className="px-5 py-3 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
              <span>Client & Completion Details</span>
              <span>Archived Order Status</span>
            </div>
            {filteredHistory.map((customer) => {
              const remaining = customer.remainingAmount;
              return (
                <div
                  key={customer.id}
                  onClick={() => onCustomerClick(customer.id)}
                  className="p-5 hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 active:bg-slate-100"
                  id={`history-cust-${customer.id}`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{customer.name}</h4>
                      <span className="text-xs font-mono text-slate-500 shrink-0">{customer.mobile}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Booked: {new Date(customer.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</span>
                      </span>
                      {customer.completedAt && (
                        <span className="flex items-center gap-1 text-teal-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done: {new Date(customer.completedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>Rs. {customer.totalPrice.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {/* Pay Status & Complete Status */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                        {customer.status}
                      </span>
                      {remaining > 0 ? (
                        <span className="text-[10px] font-bold text-rose-600">
                          Due: Rs. {remaining.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/50 px-1.5 py-0.5 rounded border border-emerald-100/30">
                          Paid
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
