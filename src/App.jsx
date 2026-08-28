import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Search, Barcode, Sparkles, RefreshCw, ShoppingBag, CheckCircle2 } from 'lucide-react';

import Navbar from './components/Navbar';
import CategoryFilter from './components/POS/CategoryFilter';
import ProductCard from './components/POS/ProductCard';
import Cart from './components/POS/Cart';
import PaymentModal from './components/POS/PaymentModal';
import ReceiptModal from './components/POS/ReceiptModal';
import ProductManager from './components/Inventory/ProductManager';
import OrderHistory from './components/Orders/OrderHistory';
import Dashboard from './components/Analytics/Dashboard';
import SupabaseConfigModal from './components/Settings/SupabaseConfigModal';

import { 
  fetchProducts, 
  fetchOrders, 
  saveProduct, 
  createOrder 
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'inventory' | 'orders' | 'analytics'
  
  // Products & Categories State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('percent'); // 'percent' | 'fixed'
  const [includeTax, setIncludeTax] = useState(true);

  // Orders State
  const [orders, setOrders] = useState([]);

  // Modals State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load Data on Mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoadingProducts(true);
    try {
      const [prods, ords] = await Promise.all([fetchProducts(), fetchOrders()]);
      setProducts(prods || []);
      setOrders(ords || []);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add to Cart Action
  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`สินค้า ${product.name} มีในสต็อกสูงสุด ${product.stock} ชิ้น`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    showToast(`เพิ่ม ${product.name} ใส่ตะกร้าแล้ว`);
  };

  // Update Cart Quantity Action
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    const product = products.find(p => p.id === id);
    if (product && newQty > product.stock) {
      showToast(`สินค้ามีสต็อกจำกัด ${product.stock} ชิ้น`);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  // Remove Item from Cart
  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear Entire Cart
  const handleClearCart = () => {
    setCartItems([]);
    setDiscount(0);
  };

  // Barcode Scanner Simulator Action
  const handleBarcodeSearch = (e) => {
    if (e.key === 'Enter' && searchQuery) {
      const found = products.find(p => p.sku.toLowerCase() === searchQuery.toLowerCase() || p.barcode === searchQuery);
      if (found) {
        handleAddToCart(found);
        setSearchQuery('');
      }
    }
  };

  // Calculate Grand Total
  const rawSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmt = discountType === 'percent' ? (rawSubtotal * (Number(discount) || 0)) / 100 : Number(discount) || 0;
  discountAmt = Math.min(rawSubtotal, discountAmt);
  const afterDiscount = Math.max(0, rawSubtotal - discountAmt);
  const taxAmt = includeTax ? afterDiscount * 0.07 : 0;
  const grandTotal = afterDiscount + taxAmt;

  // Confirm Payment & Process Order
  const handleConfirmPayment = async (paymentDetails) => {
    const orderData = {
      subtotal: rawSubtotal,
      discount: discountAmt,
      tax: taxAmt,
      total: grandTotal,
      payment_method: paymentDetails.payment_method,
      cash_received: paymentDetails.cash_received,
      change_amount: paymentDetails.change_amount,
      cashier_name: 'Cashier 01'
    };

    const created = await createOrder(orderData, cartItems);

    // Fire Confetti Animation for Celebratory Polish
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Refresh products stock & orders list
    await loadInitialData();

    // Reset Cart & Close Payment Modal
    setIsPaymentOpen(false);
    setCartItems([]);
    setDiscount(0);

    // Show Printable Receipt
    setActiveReceiptOrder(created);
    setIsReceiptOpen(true);
  };

  // Save Product (Create / Update)
  const handleSaveProduct = async (productData) => {
    await saveProduct(productData);
    await loadInitialData();
    showToast('บันทึกข้อมูลสินค้าเรียบร้อยแล้ว');
  };

  // Filter POS Products Grid
  const filteredPOSProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || p.category_name.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-grow max-w-[1700px] w-full mx-auto p-4 sm:p-6">
        
        {/* TAB 1: POS SCREEN */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
            
            {/* Left 8 Cols: Product Selection Area */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              
              {/* Top Search & Barcode Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-grow min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาอุปกรณ์กีฬาตามชื่อ, SKU, หรือสแกนบาร์โค้ด (กด Enter)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleBarcodeSearch}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <Barcode className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={loadInitialData}
                  className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="รีเฟรชสินค้า"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Horizontal Category Chips Filter */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Sports Equipment Catalog Grid */}
              {isLoadingProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 py-12 text-center text-slate-500">
                  <div className="col-span-full flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-xs">กำลังโหลดแคตตาล็อกอุปกรณ์กีฬา...</p>
                  </div>
                </div>
              ) : filteredPOSProducts.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-400">ไม่พบอุปกรณ์กีฬาในหมวดหมู่นี้</p>
                  <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPOSProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* Right 4 or 5 Cols: Interactive Shopping Cart */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-20 h-[calc(100vh-100px)]">
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onCheckout={() => setIsPaymentOpen(true)}
                discount={discount}
                setDiscount={setDiscount}
                discountType={discountType}
                setDiscountType={setDiscountType}
                includeTax={includeTax}
                setIncludeTax={setIncludeTax}
              />
            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY MANAGER */}
        {activeTab === 'inventory' && (
          <ProductManager
            products={products}
            onSaveProduct={handleSaveProduct}
            onRefreshProducts={loadInitialData}
          />
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <OrderHistory
            orders={orders}
            onViewReceipt={(order) => {
              setActiveReceiptOrder(order);
              setIsReceiptOpen(true);
            }}
          />
        )}

        {/* TAB 4: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <Dashboard
            orders={orders}
            products={products}
          />
        )}

      </main>

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={grandTotal}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* PRINTABLE RECEIPT MODAL */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={activeReceiptOrder}
      />

      {/* SUPABASE CONFIG / HELP MODAL */}
      <SupabaseConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

    </div>
  );
}
