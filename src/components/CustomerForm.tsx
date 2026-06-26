import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Info, Scissors, Sparkles } from 'lucide-react';
import { Customer, OrderStatus, Measurements } from '../types';

interface CustomerFormProps {
  initialCustomer?: Customer;
  onSave: (customerData: Omit<Customer, 'id' | 'createdAt' | 'remainingAmount'>) => void;
  onCancel: () => void;
}

export default function CustomerForm({ initialCustomer, onSave, onCancel }: CustomerFormProps) {
  const isEditMode = !!initialCustomer;

  // General Fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Measurements
  const [measurements, setMeasurements] = useState<Measurements>({
    qameezLength: '',
    shoulder: '',
    sleeve: '',
    chest: '',
    collar: '',
    trouserLength: '',
    waist: '',
    hip: '',
    thigh: '',
    bottom: '',
    
    // Traditional register fields
    qameez: '',
    shirt: '',
    waistCoat: '',
    ghera: '',
    pockets: '',
    shalwar: '',

    // Stitching options
    stitchingFront: '',
    stitchingCollarDesign: '',
    stitchingCuff: '',
    stitchingSide: '',
    stitchingPocketStyle: '',
    stitchingStep: ''
  });

  // Additional Notes
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Payment Details
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);

  // Order Details
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const defaultDelivery = new Date();
    defaultDelivery.setDate(defaultDelivery.getDate() + 7); // Default 1 week later
    return defaultDelivery.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  // Load initial data if editing
  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setMobile(initialCustomer.mobile);
      setDate(initialCustomer.date);
      setMeasurements({
        qameezLength: initialCustomer.measurements.qameezLength || '',
        shoulder: initialCustomer.measurements.shoulder || '',
        sleeve: initialCustomer.measurements.sleeve || '',
        chest: initialCustomer.measurements.chest || '',
        collar: initialCustomer.measurements.collar || '',
        trouserLength: initialCustomer.measurements.trouserLength || '',
        waist: initialCustomer.measurements.waist || '',
        hip: initialCustomer.measurements.hip || '',
        thigh: initialCustomer.measurements.thigh || '',
        bottom: initialCustomer.measurements.bottom || '',
        
        qameez: initialCustomer.measurements.qameez || '',
        shirt: initialCustomer.measurements.shirt || '',
        waistCoat: initialCustomer.measurements.waistCoat || '',
        ghera: initialCustomer.measurements.ghera || '',
        pockets: initialCustomer.measurements.pockets || '',
        shalwar: initialCustomer.measurements.shalwar || '',

        stitchingFront: initialCustomer.measurements.stitchingFront || '',
        stitchingCollarDesign: initialCustomer.measurements.stitchingCollarDesign || '',
        stitchingCuff: initialCustomer.measurements.stitchingCuff || '',
        stitchingSide: initialCustomer.measurements.stitchingSide || '',
        stitchingPocketStyle: initialCustomer.measurements.stitchingPocketStyle || '',
        stitchingStep: initialCustomer.measurements.stitchingStep || ''
      });
      setAdditionalNotes(initialCustomer.additionalNotes || '');
      setTotalPrice(initialCustomer.totalPrice || 0);
      setAdvancePayment(initialCustomer.advancePayment || 0);
      setDeliveryDate(initialCustomer.deliveryDate);
      setStatus(initialCustomer.status);
    }
  }, [initialCustomer]);

  // Auto calculate remaining amount
  const remainingAmount = Math.max(0, totalPrice - advancePayment);

  // Handle input changes
  const handleMeasurementChange = (field: keyof Measurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter customer name (نام درج کریں)');
      return;
    }
    if (!mobile.trim()) {
      alert('Please enter mobile number (موبائل نمبر درج کریں)');
      return;
    }

    onSave({
      name: name.trim(),
      mobile: mobile.trim(),
      date,
      measurements,
      additionalNotes: additionalNotes.trim(),
      totalPrice,
      advancePayment,
      deliveryDate,
      status
    });
  };

  // Structured fields with Bilingual Urdu & English Support
  const bodyMeasurementsGroup = {
    upperBody: [
      { key: 'qameez' as const, labelEn: 'Qameez', labelUr: 'قمیض', placeholder: 'e.g. 40.5"' },
      { key: 'shirt' as const, labelEn: 'Shirt', labelUr: 'شرٹ', placeholder: 'e.g. 38"' },
      { key: 'waistCoat' as const, labelEn: 'Waist Coat', labelUr: 'ویسٹ کوٹ', placeholder: 'e.g. 36"' },
      { key: 'qameezLength' as const, labelEn: 'Length / Lambai', labelUr: 'لمبائی', placeholder: 'e.g. 42"' },
      { key: 'sleeve' as const, labelEn: 'Sleeve / Bazu', labelUr: 'بازو', placeholder: 'e.g. 24"' },
      { key: 'shoulder' as const, labelEn: 'Shoulder / Tera', labelUr: 'تیرا', placeholder: 'e.g. 18.5"' },
      { key: 'collar' as const, labelEn: 'Collar / Gala', labelUr: 'گلہ', placeholder: 'e.g. 15.5"' },
      { key: 'chest' as const, labelEn: 'Chest / Chhati', labelUr: 'چھاتی', placeholder: 'e.g. 40"' },
      { key: 'waist' as const, labelEn: 'Waist / Kamar', labelUr: 'کمر', placeholder: 'e.g. 36"' },
      { key: 'ghera' as const, labelEn: 'Ghera', labelUr: 'گھیرا', placeholder: 'e.g. 24"' },
      { key: 'pockets' as const, labelEn: 'Pockets', labelUr: 'پاکٹس', placeholder: 'e.g. 2' },
    ],
    lowerBody: [
      { key: 'shalwar' as const, labelEn: 'Shalwar', labelUr: 'شلوار', placeholder: 'e.g. 39"' },
      { key: 'bottom' as const, labelEn: 'Pancha / Bottom', labelUr: 'پائنچہ', placeholder: 'e.g. 18"' },
      { key: 'trouserLength' as const, labelEn: 'Trouser Length', labelUr: 'ٹراؤزر لمبائی', placeholder: 'e.g. 38"' },
      { key: 'hip' as const, labelEn: 'Hip', labelUr: 'ہپ', placeholder: 'e.g. 42"' },
      { key: 'thigh' as const, labelEn: 'Thigh', labelUr: 'تھائی', placeholder: 'e.g. 26"' },
    ]
  };

  // Quick stitching selection presets to aid fast, single-tap entries
  const quickSuggestions: { [key: string]: { en: string; ur: string }[] } = {
    stitchingFront: [
      { en: 'Single Patti', ur: 'سنگل پٹی' },
      { en: 'Double Patti', ur: 'ڈبل پٹی' },
      { en: 'Open Shirt', ur: 'اوپن شرٹ' }
    ],
    stitchingCollarDesign: [
      { en: 'Ban Collar', ur: 'بين کالر' },
      { en: 'Simple Collar', ur: 'سادہ کالر' },
      { en: 'Round Neck', ur: 'گول گلا' }
    ],
    stitchingCuff: [
      { en: 'Gol Cuff', ur: 'گول کف' },
      { en: 'Cut Cuff', ur: 'کٹ کف' },
      { en: 'Open Sleeve', ur: 'کھلا بازو' }
    ],
    stitchingSide: [
      { en: 'Two Side Pockets', ur: 'دونوں سائیڈ جیب' },
      { en: 'One Side Pocket', ur: 'ایک سائیڈ جیب' },
      { en: 'Simple Side', ur: 'سادہ سائیڈ' }
    ],
    stitchingPocketStyle: [
      { en: 'Front Pocket', ur: 'سامنے جیب' },
      { en: 'Flap Pocket', ur: 'فلیپ جیب' },
      { en: 'No Front Pocket', ur: 'بغیر جیب' }
    ],
    stitchingStep: [
      { en: 'Single Step', ur: 'سنگل اسٹیپ' },
      { en: 'Double Step', ur: 'ڈبل اسٹیپ' },
      { en: 'No Step', ur: 'بغیر اسٹیپ' }
    ]
  };

  const stitchingFields = [
    { key: 'stitchingFront' as const, labelEn: 'Front', labelUr: 'فرنٹ', placeholder: 'e.g. Double Patti (ڈبل پٹی)' },
    { key: 'stitchingCollarDesign' as const, labelEn: 'Collar Design', labelUr: 'کالر ڈیزائن', placeholder: 'e.g. Ban Collar (بين کالر)' },
    { key: 'stitchingCuff' as const, labelEn: 'Cuff', labelUr: 'کف', placeholder: 'e.g. Cut Cuff (کٹ کف)' },
    { key: 'stitchingSide' as const, labelEn: 'Side', labelUr: 'سائیڈ', placeholder: 'e.g. Two Side Pockets (دونوں سائیڈ جیب)' },
    { key: 'stitchingPocketStyle' as const, labelEn: 'Pocket Style', labelUr: 'جیب', placeholder: 'e.g. Front Pocket (سامنے جیب)' },
    { key: 'stitchingStep' as const, labelEn: 'Step', labelUr: 'اسٹیپ', placeholder: 'e.g. Double Step (ڈبل اسٹیپ)' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden" id="customer-form-container">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-emerald-900 text-amber-300 flex items-center justify-between" id="form-header">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-emerald-800 text-amber-200 rounded-lg transition-all active:scale-95"
            id="form-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display font-bold text-white text-lg sm:text-xl flex items-center gap-2">
              <Scissors className="w-5 h-5 text-amber-300" />
              <span>{isEditMode ? 'Edit Register Entry / کھاتہ تبدیل کریں' : 'Traditional Darzi Register / درزی کھاتہ اندراج'}</span>
            </h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Traditional Pakistani Tailor Form • bilingual English & Urdu inputs with tactile large layouts
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8" id="customer-form">
        {/* Section 1: Customer Info */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/60 space-y-4" id="section-general">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-400 rounded-sm"></span>
              Customer Booking Details / کسٹمر اور بکنگ کی تفصیلات
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Customer Name</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">نام *</span>
              </div>
              <input
                id="form-customer-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Ali (محمد علی)"
                className="w-full text-base font-semibold rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">موبائل نمبر *</span>
              </div>
              <input
                id="form-customer-mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full text-base font-semibold font-mono rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none transition-all"
              />
            </div>

            {/* Booking Date */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Booking Date</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">تاریخ</span>
              </div>
              <input
                id="form-customer-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-base font-semibold rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Measurements */}
        <div className="space-y-6" id="section-measurements">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-emerald-800" />
                <span>Body Measurements (Inches) / جسمانی ناپ کی تفصیلات</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter sizes. Click and enter values directly. Traditional register format.</p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shrink-0">
              <Info className="w-3.5 h-3.5 text-amber-700" /> Tactile Large Input Layout
            </span>
          </div>

          {/* Part A: Upper Body / Kameez Specs */}
          <div className="space-y-4" id="upper-body-params">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
              <span>Upper Body Specs / قمیض، شرٹ اور ویسٹ کوٹ ناپ</span>
              <span className="flex-1 h-px bg-slate-200/80"></span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {bodyMeasurementsGroup.upperBody.map((field) => (
                <div key={field.key} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1.5 gap-1">
                    <span className="text-xxs font-bold text-slate-400 uppercase truncate" title={field.labelEn}>{field.labelEn}</span>
                    <span className="text-xs font-black text-emerald-800" dir="rtl">{field.labelUr}</span>
                  </div>
                  <input
                    id={`form-meas-${field.key}`}
                    type="text"
                    value={measurements[field.key] || ''}
                    onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full text-center text-lg sm:text-xl font-bold font-mono rounded-lg border border-slate-200 bg-slate-50/40 py-2.5 px-1 text-slate-800 focus:bg-white focus:border-emerald-700 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Part B: Lower Body / Shalwar Specs */}
          <div className="space-y-4" id="lower-body-params">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
              <span>Lower Body Specs / شلوار اور ٹراؤزر ناپ</span>
              <span className="flex-1 h-px bg-slate-200/80"></span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {bodyMeasurementsGroup.lowerBody.map((field) => (
                <div key={field.key} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1.5 gap-1">
                    <span className="text-xxs font-bold text-slate-400 uppercase truncate" title={field.labelEn}>{field.labelEn}</span>
                    <span className="text-xs font-black text-emerald-800" dir="rtl">{field.labelUr}</span>
                  </div>
                  <input
                    id={`form-meas-${field.key}`}
                    type="text"
                    value={measurements[field.key] || ''}
                    onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full text-center text-lg sm:text-xl font-bold font-mono rounded-lg border border-slate-200 bg-slate-50/40 py-2.5 px-1 text-slate-800 focus:bg-white focus:border-emerald-700 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Stitching Options */}
        <div className="bg-emerald-50/30 p-4 sm:p-5 rounded-2xl border border-emerald-100/60 space-y-6" id="section-stitching">
          <div className="border-b border-emerald-100/80 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-800" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
              Stitching Options & Style / سلائی کے ڈیزائن اور ترجیحات
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stitchingFields.map((field) => (
              <div key={field.key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">{field.labelEn}</span>
                  <span className="text-sm font-bold text-emerald-800" dir="rtl">{field.labelUr}</span>
                </div>
                
                <input
                  id={`form-stitching-${field.key}`}
                  type="text"
                  value={measurements[field.key] || ''}
                  onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full text-sm font-semibold rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition-all"
                />

                {/* Single-tap quick suggestions to boost speed */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickSuggestions[field.key]?.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleMeasurementChange(field.key, `${sug.en} (${sug.ur})`)}
                      className="text-xxs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200/60 hover:border-emerald-300 text-slate-600 px-2 py-1 rounded transition-all active:scale-95"
                    >
                      {sug.ur}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Notes */}
        <div className="space-y-4" id="section-notes">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-sm"></span>
              Additional Customizations & Details / اضافی تفصیل اور ریمارکس
            </h3>
          </div>
          <div>
            <textarea
              id="form-customer-notes"
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Enter special instructions (e.g., Cloth brand, starch preferences, heavy embroidery specifications...)"
              className="w-full text-sm font-medium rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
            />
          </div>
        </div>

        {/* Section 5: Payments and Delivery */}
        <div className="space-y-4" id="section-payments">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-700 rounded-sm"></span>
              Payment & Delivery Details / ادائیگی اور ڈیلیوری بک
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100/50">
            {/* Total Price */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Total Stitching Price</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">کل سلائی ریٹ (Rs.)</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-bold text-slate-400">
                  Rs.
                </span>
                <input
                  id="form-customer-price"
                  type="number"
                  min="0"
                  value={totalPrice || ''}
                  onChange={(e) => setTotalPrice(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-11 w-full font-mono font-bold rounded-lg border border-slate-200 bg-slate-50/40 py-2.5 px-3 text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all text-base"
                />
              </div>
            </div>

            {/* Advance Payment */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Advance Paid</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">ایڈوانس رقم (Rs.)</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-bold text-slate-400">
                  Rs.
                </span>
                <input
                  id="form-customer-advance"
                  type="number"
                  min="0"
                  value={advancePayment || ''}
                  onChange={(e) => setAdvancePayment(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-11 w-full font-mono font-bold rounded-lg border border-slate-200 bg-slate-50/40 py-2.5 px-3 text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all text-base"
                />
              </div>
            </div>

            {/* Remaining Amount (Auto calculated) */}
            <div className="flex flex-col justify-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase">Remaining / باقی واجب الادا</span>
                <span className="text-xs font-medium text-slate-400">Auto</span>
              </div>
              <span className="text-xl font-extrabold font-mono text-amber-800 mt-1">
                Rs. {remainingAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Date */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Estimated Delivery Date</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">ڈیلیوری تاریخ</span>
              </div>
              <input
                id="form-customer-delivery"
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full text-base font-semibold rounded-lg border border-slate-200 bg-slate-50/40 py-2.5 px-3 text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all"
              />
            </div>

            {/* Order Status */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Order Status</label>
                <span className="text-xs font-bold text-emerald-800" dir="rtl">آرڈر کی صورتحال</span>
              </div>
              <select
                id="form-customer-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full text-base font-semibold rounded-lg border border-slate-200 bg-slate-50/40 py-2.5 px-3 text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value={OrderStatus.PENDING}>Pending (Sewing Queued) / زیر التواء</option>
                <option value={OrderStatus.IN_PROGRESS}>In Progress (Stitching) / سلائی جاری</option>
                <option value={OrderStatus.READY}>Ready (Ironed & Hung) / تیار شدہ</option>
                <option value={OrderStatus.DELIVERED}>Delivered (Picked Up) / ڈیلیور شدہ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3" id="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-display text-sm font-semibold active:scale-95"
            id="form-cancel-btn"
          >
            Cancel / کینسل کریں
          </button>
          <button
            type="submit"
            className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-display font-bold rounded-xl py-3.5 px-8 shadow-md transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
            id="form-submit-btn"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{isEditMode ? 'Save Register Updates / محفوظ کریں' : 'Register Customer Entry / کھاتہ لکھیں'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
