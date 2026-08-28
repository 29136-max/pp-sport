import React, { useState } from 'react';
import { History, Search, Printer, Eye, Banknote, QrCode, CreditCard, Calendar } from 'lucide-react';

export default function OrderHistory({ orders, onViewReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.cashier_name && o.cashier_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = methodFilter === 'all' || o.payment_method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">ประวัติการขาย (Order History)</h2>
            <p className="text-xs text-slate-400">รายการขายทั้งหมดที่บันทึกแล้ว ({orders.length} รายการ)</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาตามเลขที่ใบเสร็จ หรือ แคชเชียร์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">วิธีชำระทั้งหมด</option>
          <option value="cash">เงินสด (Cash)</option>
          <option value="promptpay">PromptPay QR</option>
          <option value="card">บัตรเครดิต (Card)</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-4">เลขที่ใบเสร็จ</th>
                <th className="p-4">วันที่ - เวลา</th>
                <th className="p-4">วิธีชำระเงิน</th>
                <th className="p-4">จำนวนรายการ</th>
                <th className="p-4 text-right">ยอดเงินรวม</th>
                <th className="p-4 text-center">ใบเสร็จ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    ยังไม่มีประวัติการขายในระบบ
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const dateStr = new Date(o.created_at).toLocaleString('th-TH', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  });

                  return (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      <td className="p-4 font-mono font-bold text-slate-200">
                        {o.order_number}
                      </td>

                      <td className="p-4 text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </td>

                      <td className="p-4">
                        {o.payment_method === 'cash' && (
                          <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                            <Banknote className="w-3 h-3" /> เงินสด
                          </span>
                        )}
                        {o.payment_method === 'promptpay' && (
                          <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                            <QrCode className="w-3 h-3" /> PromptPay
                          </span>
                        )}
                        {o.payment_method === 'card' && (
                          <span className="bg-purple-950/60 text-purple-400 border border-purple-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> บัตรเครดิต
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-300">
                        {o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 1} รายการ
                      </td>

                      <td className="p-4 text-right font-bold text-emerald-400 text-sm font-sans">
                        ฿{Number(o.total || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => onViewReceipt(o)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ดู/พิมพ์ใบเสร็จ</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
