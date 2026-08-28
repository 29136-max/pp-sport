import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Image as ImageIcon,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Filter
} from 'lucide-react';
import { CATEGORIES } from '../../lib/supabase';

export default function ProductManager({ 
  products, 
  onSaveProduct, 
  onRefreshProducts 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out'

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category_name: 'ฟุตบอล (Football)',
    price: '',
    cost_price: '',
    stock: '',
    sku: '',
    barcode: '',
    brand: '',
    size: '',
    image_url: ''
  });

  // Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || p.category_name.includes(categoryFilter);

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'out') matchesStock = p.stock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_name: 'ฟุตบอล (Football)',
      price: '',
      cost_price: '',
      stock: '10',
      sku: `SP-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `885${Math.floor(10000000 + Math.random() * 90000000)}`,
      brand: 'Nike',
      size: 'Standard',
      image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_name: product.category_name,
      price: product.price,
      cost_price: product.cost_price || '',
      stock: product.stock,
      sku: product.sku,
      barcode: product.barcode || '',
      brand: product.brand || '',
      size: product.size || '',
      image_url: product.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      cost_price: Number(formData.cost_price || 0),
      stock: Number(formData.stock)
    };

    if (editingProduct) {
      payload.id = editingProduct.id;
    }

    await onSaveProduct(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">จัดการสต็อกอุปกรณ์กีฬา (Inventory)</h2>
            <p className="text-xs text-slate-400">เพิ่ม แก้ไข และติดตามจำนวนคงเหลือสินค้า ({products.length} รายการ)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshProducts}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>เพิ่มสินค้ากีฬาใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อสินค้า, SKU, แบรนด์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">หมวดหมู่ทั้งหมด</option>
          {CATEGORIES.filter(c => c.slug !== 'all').map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        {/* Stock Alert Filter */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setStockFilter('all')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${stockFilter === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${stockFilter === 'low' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            ใกล้หมด (&le; 5)
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${stockFilter === 'out' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            สินค้าหมด
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="p-4">สินค้า (Product)</th>
                <th className="p-4">หมวดหมู่</th>
                <th className="p-4">SKU / บาร์โค้ด</th>
                <th className="p-4">ราคาขาย</th>
                <th className="p-4">ต้นทุน</th>
                <th className="p-4">คงเหลือ</th>
                <th className="p-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    ไม่พบรายการสินค้าอุปกรณ์กีฬาตรงตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Item Photo & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-100">{p.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            {p.brand && <span className="text-emerald-400 font-bold">{p.brand}</span>}
                            {p.size && <span>• {p.size}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">{p.category_name}</td>
                    <td className="p-4 font-mono text-slate-400">{p.sku}</td>

                    <td className="p-4 font-bold text-emerald-400 font-sans">
                      ฿{Number(p.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-4 font-mono text-slate-400">
                      ฿{Number(p.cost_price || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Stock Status Badge */}
                    <td className="p-4">
                      {p.stock <= 0 ? (
                        <span className="bg-rose-950/60 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> หมด
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> {p.stock} ชิ้น
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {p.stock} ชิ้น
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="แก้ไขสินค้า"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'แก้ไขข้อมูลสินค้ากีฬา' : 'เพิ่มอุปกรณ์กีฬาใหม่'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 mb-1 font-medium">ชื่อสินค้ากีฬา *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ไม้แบดมินตัน Yonex Astrox 99"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">หมวดหมู่</label>
                  <select
                    value={formData.category_name}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter(c => c.slug !== 'all').map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">แบรนด์ (Brand)</label>
                  <input
                    type="text"
                    placeholder="เช่น Nike, Adidas, Yonex"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">ราคาขาย (฿) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">ราคาทุน (฿)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">สต็อก (ชิ้น) *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">รหัส SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">ขนาด / Size</label>
                  <input
                    type="text"
                    placeholder="เช่น Size 5 / 4U / US 10"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Image URL Input & Preview */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">URL รูปภาพสินค้า (Image URL)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  บันทึกสินค้า
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
