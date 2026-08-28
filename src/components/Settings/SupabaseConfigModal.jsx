import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Copy, ExternalLink, Code2 } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyEnvSample = () => {
    const text = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">การเชื่อมต่อ Supabase Database & Vercel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          
          {/* Status Box */}
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            isSupabaseConfigured
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            {isSupabaseConfigured ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">เชื่อมต่อ Supabase สำเร็จแล้ว</h4>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">ระบบ POS อ่านและบันทึกข้อมูลสินค้าแบบ Realtime ผ่าน Supabase Database</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-amber-300">ขณะนี้ใช้งานโหมด Local Storage (พร้อมขึ้น Vercel)</h4>
                  <p className="text-[11px] text-amber-400/80 mt-0.5">
                    ระบบพร้อมใช้งานทันที และสามารถเชื่อมต่อ Supabase Real DB ได้ง่ายๆ เพียงใส่ API Key ในไฟล์ <code className="bg-amber-950 px-1 py-0.5 rounded font-mono">.env.local</code> หรือ Vercel Environment Variables
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Guide Steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">ขั้นตอนการเชื่อมต่อ Supabase DB (3 นาที):</h4>

            <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
              <li>
                สร้างโปรเจกต์ที่ <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-medium inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a>
              </li>
              <li>
                นำไฟล์ <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">supabase_schema.sql</code> ที่เตรียมไว้ในโปรเจกต์นี้ไป Run ใน <strong>SQL Editor</strong> ของ Supabase
              </li>
              <li>
                คัดลอก <strong>Project URL</strong> และ <strong>anon public key</strong> มาใส่ใน Vercel Environment Variables:
              </li>
            </ol>

            {/* Code sample box */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 relative group">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>

              <button
                onClick={handleCopyEnvSample}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-[10px] flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            รับทราบ & ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}
