import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { generatePromptPayPayload } from '../../lib/promptpay';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  totalAmount, 
  onConfirmPayment 
}) {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'promptpay' | 'card'
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const numCash = Number(cashReceived) || 0;
  const changeAmount = Math.max(0, numCash - totalAmount);
  const isCashInsufficient = paymentMethod === 'cash' && numCash < totalAmount;

  // PromptPay Payload
  const promptpayPayload = generatePromptPayPayload('0812345678', totalAmount);
  const promptpayQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(promptpayPayload)}`;

  const handleQuickCash = (amount) => {
    setCashReceived((prev) => (Number(prev || 0) + amount).toString());
  };

  const handleExactCash = () => {
    setCashReceived(totalAmount.toString());
  };

  const handleSubmitPayment = async () => {
    if (paymentMethod === 'cash' && isCashInsufficient) return;

    setIsProcessing(true);

    setTimeout(() => {
      onConfirmPayment({
        payment_method: paymentMethod,
        cash_received: paymentMethod === 'cash' ? numCash : totalAmount,
        change_amount: paymentMethod === 'cash' ? changeAmount : 0
      });
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">ชำระเงิน (Checkout)</h2>
              <p className="text-xs text-slate-400">เลือกช่องทางการรับชำระเงิน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Amount Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border-b border-slate-800/80 p-5 text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">ยอดชำระสุทธิ (Grand Total)</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-sans mt-1">
            ฿{totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <Banknote className="w-6 h-6" />
              <span className="text-xs">เงินสด (Cash)</span>
            </button>

            <button
              onClick={() => setPaymentMethod('promptpay')}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all ${
                paymentMethod === 'promptpay'
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <QrCode className="w-6 h-6" />
              <span className="text-xs">PromptPay QR</span>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all ${
                paymentMethod === 'card'
                  ? 'bg-purple-500/15 border-purple-500 text-purple-300 font-bold shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs">บัตรเครดิต (Card)</span>
            </button>
          </div>

          {/* CASH MODE */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                  จำนวนเงินที่รับ (Received Cash Amount)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">฿</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-xl font-bold text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              {/* Denomination Shortcuts */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExactCash}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-300 font-semibold transition-colors"
                >
                  พอดี (฿{totalAmount.toLocaleString()})
                </button>
                <button
                  onClick={() => handleQuickCash(100)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
                >
                  +฿100
                </button>
                <button
                  onClick={() => handleQuickCash(500)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
                >
                  +฿500
                </button>
                <button
                  onClick={() => handleQuickCash(1000)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
                >
                  +฿1,000
                </button>
              </div>

              {/* Change Calculation Box */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isCashInsufficient
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              }`}>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block font-medium">เงินทอน (Change)</span>
                  {isCashInsufficient ? (
                    <span className="text-xs text-rose-400 mt-0.5 block">ยังขาดอีก ฿{(totalAmount - numCash).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  ) : (
                    <span className="text-2xl font-black text-emerald-400 font-sans mt-0.5 block">
                      ฿{changeAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                {!isCashInsufficient && numCash > 0 && (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                )}
              </div>
            </div>
          )}

          {/* PROMPTPAY QR MODE */}
          {paymentMethod === 'promptpay' && (
            <div className="flex flex-col items-center text-center p-4 bg-slate-950 border border-slate-800 rounded-2xl animate-fadeIn space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200">
                <img
                  src={promptpayQrUrl}
                  alt="PromptPay QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4" /> Thai PromptPay QR Code
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  สแกนผ่าน Mobile Banking (KBANK, SCB, Krungthai ฯลฯ) เพื่อชำระเงิน <strong className="text-cyan-300">฿{totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</strong>
                </p>
              </div>
            </div>
          )}

          {/* CREDIT CARD MODE */}
          {paymentMethod === 'card' && (
            <div className="flex flex-col items-center text-center p-6 bg-slate-950 border border-slate-800 rounded-2xl animate-fadeIn space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">แตะหรือเสียบบัตรที่ EDC Terminal</h4>
                <p className="text-xs text-slate-400 mt-1">รองรับ Visa, Mastercard, JCB, UnionPay</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSubmitPayment}
            disabled={isProcessing || (paymentMethod === 'cash' && isCashInsufficient)}
            className={`flex-2 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isProcessing || (paymentMethod === 'cash' && isCashInsufficient)
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                กำลังบันทึกรายการ...
              </span>
            ) : (
              <>
                <span>ยืนยันการรับชำระ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
