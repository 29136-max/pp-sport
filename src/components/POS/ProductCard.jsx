import React from 'react';
import { Plus, Tag, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div 
      className={`group relative bg-slate-900/80 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isOutOfStock 
          ? 'border-slate-800 opacity-60' 
          : 'border-slate-800/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10'
      }`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-900 text-slate-700">
            ⚽
          </div>
        )}

        {/* Brand Tag */}
        {product.brand && (
          <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {product.brand}
          </span>
        )}

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="bg-rose-950/90 backdrop-blur-md text-rose-400 border border-rose-500/30 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> สินค้าหมด
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> เหลือ {product.stock} ชิ้น
            </span>
          ) : (
            <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/50 text-[10px] font-medium px-2 py-0.5 rounded-md">
              คงเหลือ {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
            <span className="truncate">{product.category_name}</span>
            {product.size && (
              <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                {product.size}
              </span>
            )}
          </div>
          <h3 className="font-medium text-sm text-slate-100 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">SKU: {product.sku}</p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400 block">ราคาขาย</span>
            <div className="text-base font-bold text-emerald-400 font-sans">
              ฿{Number(product.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20'
            }`}
            title={isOutOfStock ? 'สินค้าหมด' : 'เพิ่มใส่ตะกร้า'}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
