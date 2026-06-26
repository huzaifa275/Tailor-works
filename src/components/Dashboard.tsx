import { motion } from 'motion/react';
import { Users, Clock, CheckCircle2, CircleDollarSign, Plus, ArrowRight, Calendar, Search } from 'lucide-react';
import { Customer, OrderStatus } from '../types';

interface DashboardProps {
  customers: Customer[];
  onAddCustomerClick: () => void;
  onCustomerClick: (id: string) => void;
  onSearchClick: () => void;
}

export default function Dashboard({ customers, onAddCustomerClick, onCustomerClick, onSearchClick }: DashboardProps) {
  // Statistics calculations
  const totalCustomers = customers.filter(c => c.status !== OrderStatus.COMPLETED).length;
  
  // Pending orders (Pending and In Progress status)
  const totalPending = customers.filter(
    c => c.status === OrderStatus.PENDING || c.status === OrderStatus.IN_PROGRESS
  ).length;

  // Completed orders
  const totalCompleted = customers.filter(
    c => c.status === OrderStatus.COMPLETED
  ).length;

  // Total amount due (remaining amount across active customers)
  const totalAmountDue = customers
    .filter(c => c.status !== OrderStatus.COMPLETED)
    .reduce((sum, c) => sum + c.remainingAmount, 0);

  // Urgent pending orders sorted by delivery date (closest first)
  const activeOrders = customers
    .filter(c => c.status !== OrderStatus.COMPLETED)
    .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6" id="dashboard-root">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700 relative overflow-hidden" id="dashboard-banner">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400 rounded-full mix-blend-screen filter blur-2xl opacity-10 -mr-8 -mt-8"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="bg-emerald-700/80 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Pakistani Tailoring Boutique
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display mt-2 tracking-tight">
              Assalam-o-Alaikum!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
              Welcome to your digital tailoring register. Manage measurements, keep track of payments, and deliver perfection.
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={onSearchClick}
              className="bg-white/10 hover:bg-white/15 text-white p-3 rounded-xl transition-all flex items-center justify-center border border-white/10 active:scale-95"
              title="Search Customer"
              id="dash-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onAddCustomerClick}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-display font-medium px-4 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
              id="dash-new-customer-btn"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Stat 1: Total Customers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
          id="stat-customers"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customers</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-800">{totalCustomers}</h3>
            <p className="text-xxs text-slate-400 mt-1">Saved in database</p>
          </div>
        </motion.div>

        {/* Stat 2: Total Pending Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
          id="stat-pending"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-800">{totalPending}</h3>
            <p className="text-xxs text-slate-400 mt-1">In progress & pending</p>
          </div>
        </motion.div>

        {/* Stat 3: Total Completed Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
          id="stat-completed"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Orders</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-800">{totalCompleted}</h3>
            <p className="text-xxs text-slate-400 mt-1">Ready & delivered</p>
          </div>
        </motion.div>

        {/* Stat 4: Total Amount Due */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
          id="stat-due"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount Due</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-emerald-800">Rs. {totalAmountDue.toLocaleString()}</h3>
            <p className="text-xxs text-rose-500 font-semibold mt-1">Remaining balance</p>
          </div>
        </motion.div>
      </div>

      {/* Urgent Deliveries / Recent Orders List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="recent-deliveries-card">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between" id="recent-deliveries-header">
          <div>
            <h2 className="font-display font-bold text-slate-900 text-lg">
              Upcoming Deliveries
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Active tailoring orders sorted by delivery deadline
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            {activeOrders.length} Orders Active
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm" id="no-active-orders">
            🎉 All orders have been delivered! No active deliveries pending.
          </div>
        ) : (
          <div className="divide-y divide-slate-50" id="active-orders-list">
            {activeOrders.map((customer) => {
              const remaining = customer.totalPrice - customer.advancePayment;
              return (
                <div
                  key={customer.id}
                  onClick={() => onCustomerClick(customer.id)}
                  className="p-4 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-4 active:bg-slate-100"
                  id={`dashboard-cust-${customer.id}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{customer.name}</h4>
                      <span className="text-xxs font-mono text-slate-400 shrink-0">{customer.mobile}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Delivery: {new Date(customer.deliveryDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </span>
                      {remaining > 0 && (
                        <span className="text-rose-600 font-medium">
                          Bal: Rs. {remaining}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Badge */}
                    <span className={`text-xxs font-semibold px-2.5 py-1 rounded-full border ${
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
