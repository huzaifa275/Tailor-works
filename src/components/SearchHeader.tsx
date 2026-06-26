import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, Scissors, X, History } from 'lucide-react';
import { Customer, OrderStatus } from '../types';

interface SearchHeaderProps {
  customers: Customer[];
  onSelectCustomer: (id: string) => void;
  onClearSearch?: () => void;
}

export default function SearchHeader({ customers, onSelectCustomer, onClearSearch }: SearchHeaderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter customers as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const filtered = customers.filter(
      c => c.name.toLowerCase().includes(lowerQuery) || c.mobile.includes(lowerQuery)
    );

    setResults(filtered);
    setIsOpen(true);
  }, [query, customers]);

  // Handle outside clicks to close the suggestion panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (id: string) => {
    onSelectCustomer(id);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <div className="relative w-full z-30" ref={containerRef} id="search-header-container">
      {/* Search Input Box */}
      <div className="relative flex items-center" id="search-input-wrapper">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-emerald-800" />
        </div>
        <input
          id="search-customer-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer by name or mobile number..."
          className="w-full bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-10 text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/5 text-sm custom-shadow"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-all"
            id="search-clear-btn"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestion Panel */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-50"
          id="search-dropdown-panel"
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
              <Scissors className="w-5 h-5 stroke-[1.5] text-slate-300" />
              <span>No customer found matching "{query}"</span>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>Matching Records ({results.length})</span>
                <span>Tap to Open Profile</span>
              </div>
              {results.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelect(customer.id)}
                  className="w-full p-3.5 hover:bg-slate-50 transition-all text-left flex items-center justify-between gap-4 active:bg-slate-100"
                  id={`search-item-${customer.id}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 text-sm truncate">{customer.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.mobile}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Tiny Status Indicator */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      customer.status === OrderStatus.PENDING
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : customer.status === OrderStatus.IN_PROGRESS
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : customer.status === OrderStatus.READY
                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
