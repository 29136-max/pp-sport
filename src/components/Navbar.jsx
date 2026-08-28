import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  History, 
  BarChart3, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar({ activeTab, setActiveTab, onOpenConfig }) {
  const tabs = [
    { id: 'pos', label: 'หน้าขายสินค้า (POS)', icon: ShoppingBag },
    { id: 'inventory', label: 'สต็อกสินค้า (Inventory)', icon: Package },
    { id: 'orders', label: 'ประวัติการขาย (Orders)', icon: History },
    { id: 'analytics', label: 'รายงานยอดขาย (Analytics)', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Store Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight font-sans">SPORT PRO POS</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">v1.0 Vercel</span>
            </div>
            <p className="text-xs text-slate-400">ระบบขายอุปกรณ์กีฬา & จัดการสต็อก</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Badges & Database Settings Button */}
        <div className="flex items-center gap-3">
          
          {/* Supabase Status Indicator Button */}
          <button
            onClick={onOpenConfig}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isSupabaseConfigured
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
            }`}
            title="คลิกเพื่อตั้งค่า Supabase Database"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Database:</span>
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Supabase Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <AlertCircle className="w-3 h-3" /> Local Mode (Vercel Ready)
              </span>
            )}
          </button>

          {/* Cashier Badge */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-200 font-medium">แคชเชียร์: 01 (พร้อมใช้งาน)</span>
          </div>

        </div>

      </div>
    </header>
  );
}
