import React from 'react';
import { X, Printer, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="font-bold text-white text-base">ชำระเงินสำเร็จ (Receipt)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-200 space-y-4" id="printable-receipt">
          
          {/* Store Info */}
          <div className="text-center border-b border-dashed border-slate-700/80 pb-4 space-y-1">
            <div className="text-base font-bold font-sans text-white uppercase tracking-wider">⚽ SPORT PRO POS</div>
            <div className="text-[11px] text-slate-400">สาขาใหญ่ สยามสแควร์ กรุงเทพฯ</div>
            <div className="text-[10px] text-slate-500">โทร: 02-123-4567 | TAX ID: 0105565000999</div>
          </div>

          {/* Receipt Meta */}
          <div className="border-b border-dashed border-slate-700/80 pb-3 space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>เลขที่ใบเสร็จ:</span>
              <span className="font-bold text-slate-200">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span>วันที่เวลา:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>แคชเชียร์:</span>
              <span>{order.cashier_name || 'Cashier 01'}</span>
            </div>
            <div className="flex justify-between">
              <span>วิธีชำระ:</span>
              <span className="uppercase text-emerald-400 font-bold">{order.payment_method}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border-b border-dashed border-slate-700/80 pb-3 space-y-2">
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase">
              <span className="col-span-6">รายการ</span>
              <span className="col-span-2 text-center">จำนวน</span>
              <span className="col-span-4 text-right">ราคา</span>
            </div>

            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-slate-300">
                <span className="col-span-6 truncate font-sans">{item.product_name || item.name}</span>
                <span className="col-span-2 text-center">x{item.quantity}</span>
                <span className="col-span-4 text-right font-mono">
                  ฿{((item.unit_price || item.price) * item.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1.5 pt-1 text-slate-300">
            <div className="flex justify-between">
              <span>ยอดรวม (Subtotal)</span>
              <span>฿{Number(order.subtotal || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>

            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>ส่วนลด (Discount)</span>
                <span>-฿{Number(order.discount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {Number(order.tax) > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>ภาษี (VAT 7%)</span>
                <span>฿{Number(order.tax).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-700">
              <span>ยอดชำระสุทธิ (TOTAL)</span>
              <span className="text-emerald-400 font-sans">฿{Number(order.total || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>

            {order.payment_method === 'cash' && (
              <>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>รับเงินสด:</span>
                  <span>฿{Number(order.cash_received || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>เงินทอน:</span>
                  <span className="text-emerald-400 font-bold">฿{Number(order.change_amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Barcode Simulation */}
          <div className="text-center pt-4 border-t border-dashed border-slate-700/80 space-y-1.5">
            <div className="font-mono text-slate-400 tracking-widest text-lg font-bold">||||| | |||||| |||| | |||</div>
            <p className="text-[10px] text-slate-400 font-sans">ขอบคุณที่ใช้อบริการ SPORT PRO</p>
            <p className="text-[9px] text-slate-500 font-sans">สินค้าซื้อแล้วรับเปลี่ยนภายใน 7 วัน พร้อมใบเสร็จ</p>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ใบเสร็จ (Print)</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>ทำรายการถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
