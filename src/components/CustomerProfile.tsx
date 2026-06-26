import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Edit, Trash2, Calendar, Phone, Clock, 
  CircleDollarSign, FileText, CheckCircle, Scissors, AlertTriangle, CheckSquare, Sparkles
} from 'lucide-react';
import { Customer, OrderStatus, Measurements } from '../types';

interface CustomerProfileProps {
  customer: Customer;
  onEditClick: (customer: Customer) => void;
  onDeleteClick: (id: string) => void;
  onCompleteClick: (id: string) => void;
  onBackClick: () => void;
}

export default function CustomerProfile({ customer, onEditClick, onDeleteClick, onCompleteClick, onBackClick }: CustomerProfileProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const handleDeleteConfirm = () => {
    onDeleteClick(customer.id);
    setShowDeleteConfirm(false);
  };

  const handleCompleteConfirm = () => {
    onCompleteClick(customer.id);
    setShowCompleteConfirm(false);
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case OrderStatus.IN_PROGRESS:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case OrderStatus.READY:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case OrderStatus.DELIVERED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case OrderStatus.COMPLETED:
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Structured fields with Bilingual Urdu & English Support matching the register form
  const upperBodyFields = [
    { key: 'qameez' as const, labelEn: 'Qameez', labelUr: 'قمیض' },
    { key: 'shirt' as const, labelEn: 'Shirt', labelUr: 'شرٹ' },
    { key: 'waistCoat' as const, labelEn: 'Waist Coat', labelUr: 'ویسٹ کوٹ' },
    { key: 'qameezLength' as const, labelEn: 'Length / Lambai', labelUr: 'لمبائی' },
    { key: 'sleeve' as const, labelEn: 'Sleeve / Bazu', labelUr: 'بازو' },
    { key: 'shoulder' as const, labelEn: 'Shoulder / Tera', labelUr: 'تیرا' },
    { key: 'collar' as const, labelEn: 'Collar / Gala', labelUr: 'گلہ' },
    { key: 'chest' as const, labelEn: 'Chest / Chhati', labelUr: 'چھاتی' },
    { key: 'waist' as const, labelEn: 'Waist / Kamar', labelUr: 'کمر' },
    { key: 'ghera' as const, labelEn: 'Ghera', labelUr: 'گھیرا' },
    { key: 'pockets' as const, labelEn: 'Pockets', labelUr: 'پاکٹس' },
  ];

  const lowerBodyFields = [
    { key: 'shalwar' as const, labelEn: 'Shalwar', labelUr: 'شلوار' },
    { key: 'bottom' as const, labelEn: 'Pancha / Bottom', labelUr: 'پائنچہ' },
    { key: 'trouserLength' as const, labelEn: 'Trouser Length', labelUr: 'ٹراؤزر لمبائی' },
    { key: 'hip' as const, labelEn: 'Hip', labelUr: 'ہپ' },
    { key: 'thigh' as const, labelEn: 'Thigh', labelUr: 'تھائی' },
  ];

  const stitchingFields = [
    { key: 'stitchingFront' as const, labelEn: 'Front', labelUr: 'فرنٹ' },
    { key: 'stitchingCollarDesign' as const, labelEn: 'Collar Design', labelUr: 'کالر ڈیزائن' },
    { key: 'stitchingCuff' as const, labelEn: 'Cuff', labelUr: 'کف' },
    { key: 'stitchingSide' as const, labelEn: 'Side', labelUr: 'سائیڈ' },
    { key: 'stitchingPocketStyle' as const, labelEn: 'Pocket Style', labelUr: 'جیب' },
    { key: 'stitchingStep' as const, labelEn: 'Step', labelUr: 'اسٹیپ' },
  ];

  return (
    <div className="space-y-6" id="profile-root">
      {/* Navigation and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm" id="profile-navigation-bar">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-display text-sm font-semibold p-2.5 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
          id="profile-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Register / واپس رجسٹر</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {customer.status !== OrderStatus.COMPLETED && (
            <button
              onClick={() => setShowCompleteConfirm(true)}
              className="flex items-center gap-1.5 bg-emerald-850 hover:bg-emerald-900 text-amber-300 font-display text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md border border-emerald-800"
              id="profile-complete-btn"
            >
              <CheckSquare className="w-4 h-4 text-amber-300" />
              <span>Complete Order / مکمل آرڈر</span>
            </button>
          )}
          <button
            onClick={() => onEditClick(customer)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-display text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 border border-slate-200"
            id="profile-edit-btn"
          >
            <Edit className="w-4 h-4 text-emerald-800" />
            <span>Edit Book / تبدیل کریں</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-display text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 border border-rose-100"
            id="profile-delete-btn"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete / خارج کریں</span>
          </button>
        </div>
      </div>

      {/* Customer Hero Banner */}
      <div className="bg-emerald-900 text-amber-300 border border-emerald-950 p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4" id="profile-hero-card">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">{customer.name}</h1>
            <span className={`text-xxs font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(customer.status)}`}>
              • {customer.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-emerald-100 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 font-mono">
              <Phone className="w-4 h-4 text-amber-300/80" />
              <a href={`tel:${customer.mobile}`} className="hover:underline text-white font-semibold">{customer.mobile}</a>
            </span>
            <span className="text-emerald-800">|</span>
            <span className="flex items-center gap-1.5 text-white/95">
              <Calendar className="w-4 h-4 text-amber-300/80" />
              <span>Booked: {new Date(customer.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} ({customer.date})</span>
            </span>
          </div>
        </div>

        {customer.status === OrderStatus.COMPLETED && customer.completedAt ? (
          <div className="flex items-center gap-3 bg-emerald-950 p-4 rounded-xl border border-emerald-800 shrink-0" id="completion-info-badge">
            <CheckCircle className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <p className="text-xxs font-bold text-emerald-300/80 uppercase tracking-wider">Completion Date</p>
              <p className="text-sm font-bold text-white font-display">
                {new Date(customer.completedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-emerald-950 p-4 rounded-xl border border-emerald-800 shrink-0 animate-pulse" id="delivery-info-badge">
            <Clock className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <p className="text-xxs font-bold text-emerald-300/80 uppercase tracking-wider">Estimated Delivery</p>
              <p className="text-sm font-bold text-white font-display">
                {new Date(customer.deliveryDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profile-details-grid">
        {/* Left 2 Columns: Measurements, Stitching and Custom Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Measurements Card */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden" id="profile-measurements-card">
            <div className="p-5 border-b border-slate-100 bg-emerald-950 text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-300" />
                <h2 className="font-display font-bold text-white text-base">Customer Tailoring Parameters / ناپ کی تفصیلات</h2>
              </div>
              <span className="text-xxs text-emerald-200 bg-emerald-800 border border-emerald-700 px-2 py-0.5 rounded-full font-semibold">Inches</span>
            </div>

            <div className="p-6 space-y-8">
              {/* Upper Body (Qameez) */}
              <div className="space-y-4" id="upper-body-params">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <span>Upper Body Specs / قمیض، شرٹ اور ویسٹ کوٹ ناپ</span>
                  <span className="flex-1 h-px bg-slate-100"></span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {upperBodyFields.map((field) => (
                    <div key={field.key} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-center flex flex-col justify-between hover:shadow-sm transition-all">
                      <div className="flex justify-between items-center text-slate-400 font-bold mb-1.5 gap-1">
                        <span className="text-xxs uppercase truncate" title={field.labelEn}>{field.labelEn}</span>
                        <span className="text-xs text-emerald-900" dir="rtl">{field.labelUr}</span>
                      </div>
                      <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
                        {customer.measurements[field.key] ? `${customer.measurements[field.key]}"` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower Body (Shalwar / Trouser) */}
              <div className="space-y-4" id="lower-body-params">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <span>Lower Body Specs / شلوار اور ٹراؤزر ناپ</span>
                  <span className="flex-1 h-px bg-slate-100"></span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lowerBodyFields.map((field) => (
                    <div key={field.key} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-center flex flex-col justify-between hover:shadow-sm transition-all">
                      <div className="flex justify-between items-center text-slate-400 font-bold mb-1.5 gap-1">
                        <span className="text-xxs uppercase truncate" title={field.labelEn}>{field.labelEn}</span>
                        <span className="text-xs text-emerald-900" dir="rtl">{field.labelUr}</span>
                      </div>
                      <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
                        {customer.measurements[field.key] ? `${customer.measurements[field.key]}"` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stitching Styles Card */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden" id="profile-stitching-card">
            <div className="p-5 border-b border-slate-100 bg-emerald-50/70 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-950" />
              <h2 className="font-display font-bold text-emerald-950 text-base">Selected Stitching Styles / سلائی کے منتخب کردہ ڈیزائن</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stitchingFields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xxs font-bold text-slate-400 uppercase">{field.labelEn}</span>
                      <span className="text-xs font-bold text-emerald-950 mt-0.5">{field.labelUr}</span>
                    </div>
                    <span className="text-sm font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 shadow-xs max-w-[60%] truncate text-right">
                      {customer.measurements[field.key] || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Notes Card */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden" id="profile-notes-card">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-800" />
              <h2 className="font-display font-bold text-slate-800 text-base">Special Customizations / اضافی تفصیل اور ریمارکس</h2>
            </div>
            <div className="p-6">
              {customer.additionalNotes ? (
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  {customer.additionalNotes}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic" id="no-notes-placeholder">
                  No additional stitching details or custom notes written for this customer.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Payment and Financial Book */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden" id="profile-financial-card">
            <div className="p-5 border-b border-slate-100 bg-emerald-950 text-amber-300 flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5 text-amber-300" />
              <h2 className="font-display font-bold text-white text-base">Payment Status Book / رقم اور ادائیگی کھاتہ</h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Financial entries */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Stitching Rate / سلائی ریٹ</span>
                  <span className="font-mono font-bold text-slate-800">Rs. {customer.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-600">
                  <span>Advance Payment / ایڈوانس رقم</span>
                  <span className="font-mono font-bold">Rs. {customer.advancePayment.toLocaleString()}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">Remaining Balance / بقایا واجب الادا</span>
                  <span className={`text-xl font-bold font-mono ${customer.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    Rs. {customer.remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Visual Progress Bar */}
              <div className="pt-2">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-600 h-full" 
                    style={{ width: `${customer.totalPrice > 0 ? (customer.advancePayment / customer.totalPrice) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xxs text-slate-400 mt-1.5 font-semibold">
                  <span>Paid: {customer.totalPrice > 0 ? Math.round((customer.advancePayment / customer.totalPrice) * 100) : 0}%</span>
                  <span>Due: Rs. {customer.remainingAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Status Action Alert */}
              <div className={`p-4 rounded-xl border flex items-start gap-2.5 ${
                customer.remainingAmount > 0 
                  ? 'bg-rose-50/40 border-rose-100 text-rose-800' 
                  : 'bg-emerald-50/40 border-emerald-100 text-emerald-800'
              }`}>
                <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${customer.remainingAmount > 0 ? 'text-rose-500' : 'text-emerald-600'}`} />
                <div className="text-xs">
                  <p className="font-bold">
                    {customer.remainingAmount > 0 ? 'Outstanding / بقایا واجب الادا' : 'Fully Paid / تمام رقم موصول'}
                  </p>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    {customer.remainingAmount > 0 
                      ? `Collect Rs. ${customer.remainingAmount.toLocaleString()} upon delivering this outfit.`
                      : 'Zero balance. No further charges due on delivery.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {/* Complete Order Confirmation Modal */}
        {showCompleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/65 flex items-center justify-center p-4 z-50 backdrop-blur-sm" id="complete-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center relative overflow-hidden"
              id="complete-modal-box"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Mark this order as completed?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                By marking this order as completed, it will be automatically moved to your digital tailoring History archives.
              </p>
              
              <div className="flex items-center justify-center gap-3 mt-6" id="complete-modal-actions">
                <button
                  onClick={() => setShowCompleteConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-display text-xs font-semibold"
                  id="complete-modal-cancel-btn"
                >
                  No, Go Back
                </button>
                <button
                  onClick={handleCompleteConfirm}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-950 text-amber-300 transition-all font-display text-xs font-semibold shadow-md active:scale-95"
                  id="complete-modal-confirm-btn"
                >
                  Yes, Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/65 flex items-center justify-center p-4 z-50 backdrop-blur-sm" id="delete-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center relative overflow-hidden"
              id="delete-modal-box"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Delete Customer Entry?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete this customer? This action is permanent and will completely erase <strong>{customer.name}</strong>'s measurements and stitching book records from the database.
              </p>
              
              <div className="flex items-center justify-center gap-3 mt-6" id="modal-actions">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-display text-xs font-semibold"
                  id="modal-cancel-btn"
                >
                  No, Keep Book
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all font-display text-xs font-semibold shadow-md active:scale-95"
                  id="modal-confirm-btn"
                >
                  Yes, Delete Customer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
