import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Percent, 
  Tag, 
  CreditCard, 
  Receipt,
  X
} from 'lucide-react';

export default function Cart({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  includeTax,
  setIncludeTax
}) {
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // Math Calculations
  const rawSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = (rawSubtotal * (Number(discount) || 0)) / 100;
  } else {
    discountAmount = Number(discount) || 0;
  }
  discountAmount = Math.min(rawSubtotal, discountAmount);

  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const taxAmount = includeTax ? subtotalAfterDiscount * 0.07 : 0;
  const grandTotal = subtotalAfterDiscount + taxAmount;

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Cart Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">ตะกร้าสินค้า (Cart)</h2>
            <p className="text-xs text-slate-400">รายการสินค้าที่เลือก ({totalItemCount} ชิ้น)</p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/20 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            title="ล้างตะกร้า"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ล้างทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Cart Line Items List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-slate-400">ยังไม่มีสินค้าในตะกร้า</p>
            <p className="text-xs text-slate-500 mt-1">คลิกเลือกอุปกรณ์กีฬาเพื่อเริ่มรายการขาย</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-slate-700 transition-colors"
            >
              {/* Product Thumbnail */}
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
              />

              {/* Item Info */}
              <div className="flex-grow min-w-0">
                <h4 className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-emerald-400">
                    ฿{Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                  {item.size && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                      {item.size}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-slate-200">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Line Subtotal & Delete */}
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-200">
                  ฿{(item.price * item.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 mt-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 ml-auto" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Checkout Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        
        {/* Discount Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
          <button
            onClick={() => setShowDiscountInput(!showDiscountInput)}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{discount > 0 ? `ส่วนลด (${discountType === 'percent' ? `${discount}%` : `฿${discount}`})` : '+ เพิ่มส่วนลด'}</span>
          </button>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTax}
              onChange={(e) => setIncludeTax(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
          </label>
        </div>

        {/* Discount Input Drawer */}
        {showDiscountInput && (
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-slate-700 text-xs">
              <button
                onClick={() => setDiscountType('percent')}
                className={`px-2.5 py-1 ${discountType === 'percent' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                %
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`px-2.5 py-1 ${discountType === 'fixed' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                ฿
              </button>
            </div>
            <input
              type="number"
              min="0"
              placeholder={discountType === 'percent' ? 'จำนวน %' : 'จำนวนเงิน (บาท)'}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            {discount > 0 && (
              <button
                onClick={() => setDiscount(0)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Totals Breakdown */}
        <div className="space-y-1.5 text-xs text-slate-400 pt-1">
          <div className="flex justify-between">
            <span>ยอดรวมสินค้า (Subtotal)</span>
            <span className="font-mono text-slate-200">฿{rawSubtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>ส่วนลด (Discount)</span>
              <span className="font-mono">-฿{discountAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          {includeTax && (
            <div className="flex justify-between">
              <span>ภาษี (VAT 7%)</span>
              <span className="font-mono text-slate-200">฿{taxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              ยอดสุทธิ (Total)
            </span>
            <span className="text-xl font-extrabold text-emerald-400 font-sans">
              ฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Checkout Action Button */}
        <button
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            cartItems.length === 0
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-emerald-500/25'
          }`}
        >
          <CreditCard className="w-5 h-5 stroke-[2.5]" />
          <span>ชำระเงิน (฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })})</span>
        </button>

      </div>
    </div>
  );
}
