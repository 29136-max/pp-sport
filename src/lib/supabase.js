import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Seed Data for Fallback/Offline Mode
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'ลูกฟุตบอล Molten Vantaggio 5000 (FIFA Quality)',
    category_name: 'ฟุตบอล (Football)',
    price: 1890,
    cost_price: 1200,
    stock: 25,
    sku: 'FB-MOL-5000',
    barcode: '885123450001',
    image_url: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&auto=format&fit=crop&q=80',
    brand: 'Molten',
    size: 'Size 5'
  },
  {
    id: 'prod-2',
    name: 'ลูกฟุตบอล Nike Flight Official Match',
    category_name: 'ฟุตบอล (Football)',
    price: 4500,
    cost_price: 3100,
    stock: 12,
    sku: 'FB-NKE-FLT',
    barcode: '885123450002',
    image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    brand: 'Nike',
    size: 'Size 5'
  },
  {
    id: 'prod-3',
    name: 'ไม้แบดมินตัน Yonex Astrox 99 Pro',
    category_name: 'แบดมินตัน (Badminton)',
    price: 6490,
    cost_price: 4800,
    stock: 10,
    sku: 'BD-YNX-AX99',
    barcode: '885123450003',
    image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
    brand: 'Yonex',
    size: '4U/G5'
  },
  {
    id: 'prod-4',
    name: 'ลูกขนไก่ Yonex AS-30 (กล่อง 12 ลูก)',
    category_name: 'แบดมินตัน (Badminton)',
    price: 980,
    cost_price: 750,
    stock: 45,
    sku: 'BD-YNX-AS30',
    barcode: '885123450004',
    image_url: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=600&auto=format&fit=crop&q=80',
    brand: 'Yonex',
    size: 'Standard'
  },
  {
    id: 'prod-5',
    name: 'ลูกบาสเกตบอล Spalding TF-1000 Legacy',
    category_name: 'บาสเกตบอล (Basketball)',
    price: 2990,
    cost_price: 1950,
    stock: 18,
    sku: 'BK-SPL-1000',
    barcode: '885123450005',
    image_url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&auto=format&fit=crop&q=80',
    brand: 'Spalding',
    size: 'Size 7'
  },
  {
    id: 'prod-6',
    name: 'รองเท้าวิ่ง Nike Vaporfly 3 Racing',
    category_name: 'วิ่ง & รองเท้า (Running & Shoes)',
    price: 8500,
    cost_price: 6200,
    stock: 8,
    sku: 'RN-NKE-VP3',
    barcode: '885123450006',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    brand: 'Nike',
    size: 'US 10 / EU 44'
  },
  {
    id: 'prod-7',
    name: 'รองเท้าวิ่ง Adidas Ultraboost Light',
    category_name: 'วิ่ง & รองเท้า (Running & Shoes)',
    price: 7000,
    cost_price: 5000,
    stock: 14,
    sku: 'RN-ADI-UBL',
    barcode: '885123450007',
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
    brand: 'Adidas',
    size: 'US 9.5 / EU 43'
  },
  {
    id: 'prod-8',
    name: 'ดัมเบลปรับน้ำหนักได้ Bowflex SelectTech (คู่)',
    category_name: 'ฟิตเนส (Fitness)',
    price: 12900,
    cost_price: 9200,
    stock: 5,
    sku: 'FT-BWF-552',
    barcode: '885123450008',
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    brand: 'Bowflex',
    size: '24kg Pair'
  },
  {
    id: 'prod-9',
    name: 'เสื่อโยคะลูเลมอน Lululemon Reversible Mat 5mm',
    category_name: 'ฟิตเนส (Fitness)',
    price: 2850,
    cost_price: 1800,
    stock: 20,
    sku: 'FT-LUL-MAT',
    barcode: '885123450009',
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
    brand: 'Lululemon',
    size: '5mm Pink/Black'
  },
  {
    id: 'prod-10',
    name: 'แว่นตาว่ายน้ำ Speedo Fastskin Hyper Elite',
    category_name: 'ว่ายน้ำ (Swimming)',
    price: 2190,
    cost_price: 1400,
    stock: 30,
    sku: 'SW-SPD-HYP',
    barcode: '885123450010',
    image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop&q=80',
    brand: 'Speedo',
    size: 'One Size'
  },
  {
    id: 'prod-11',
    name: 'ลูกวอลเลย์บอล Mikasa V200W Official Match Ball',
    category_name: 'วอลเลย์บอล (Volleyball)',
    price: 2650,
    cost_price: 1800,
    stock: 16,
    sku: 'VB-MKS-V200',
    barcode: '885123450011',
    image_url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&auto=format&fit=crop&q=80',
    brand: 'Mikasa',
    size: 'Size 5'
  }
];

export const CATEGORIES = [
  { id: 'cat-all', name: 'ทั้งหมด (All)', slug: 'all', icon: 'LayoutGrid' },
  { id: 'cat-1', name: 'ฟุตบอล (Football)', slug: 'football', icon: 'CircleDot' },
  { id: 'cat-2', name: 'แบดมินตัน (Badminton)', slug: 'badminton', icon: 'Zap' },
  { id: 'cat-3', name: 'บาสเกตบอล (Basketball)', slug: 'basketball', icon: 'Circle' },
  { id: 'cat-4', name: 'วิ่ง & รองเท้า (Running & Shoes)', slug: 'running', icon: 'Footprints' },
  { id: 'cat-5', name: 'ฟิตเนส (Fitness)', slug: 'fitness', icon: 'Dumbbell' },
  { id: 'cat-6', name: 'ว่ายน้ำ (Swimming)', slug: 'swimming', icon: 'Waves' },
  { id: 'cat-7', name: 'วอลเลย์บอล (Volleyball)', slug: 'volleyball', icon: 'Trophy' }
];

// Data Access Layer: Switches smoothly between Supabase and LocalStorage Fallback
export async function fetchProducts() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local data', err);
    }
  }

  // Fallback to LocalStorage
  const local = localStorage.getItem('sports_pos_products');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('sports_pos_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export async function saveProduct(product) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (product.id && !product.id.startsWith('prod-')) {
        const { data, error } = await supabase
          .from('products')
          .update(product)
          .eq('id', product.id)
          .select();
        if (!error && data) return data[0];
      } else {
        const newProduct = { ...product };
        delete newProduct.id; // Allow Supabase to generate UUID
        const { data, error } = await supabase
          .from('products')
          .insert([newProduct])
          .select();
        if (!error && data) return data[0];
      }
    } catch (err) {
      console.warn('Supabase save failed, saving to local storage', err);
    }
  }

  // LocalStorage Fallback logic
  const local = localStorage.getItem('sports_pos_products');
  let products = local ? JSON.parse(local) : INITIAL_PRODUCTS;
  
  if (product.id) {
    products = products.map(p => p.id === product.id ? { ...p, ...product } : p);
  } else {
    const created = {
      ...product,
      id: `prod-${Date.now()}`
    };
    products.unshift(created);
  }
  localStorage.setItem('sports_pos_products', JSON.stringify(products));
  return product.id ? product : products[0];
}

export async function updateProductStock(productId, quantityReduced) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Fetch current stock
      const { data: prod } = await supabase.from('products').select('stock').eq('id', productId).single();
      if (prod) {
        const newStock = Math.max(0, prod.stock - quantityReduced);
        await supabase.from('products').update({ stock: newStock }).eq('id', productId);
      }
    } catch (err) {
      console.warn('Supabase stock update error', err);
    }
  }

  // Update local storage state
  const local = localStorage.getItem('sports_pos_products');
  if (local) {
    const products = JSON.parse(local);
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock - quantityReduced) };
      }
      return p;
    });
    localStorage.setItem('sports_pos_products', JSON.stringify(updated));
  }
}

export async function createOrder(orderData, items) {
  const orderId = `ORD-${Date.now()}`;
  const orderNumber = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

  const finalOrder = {
    id: orderId,
    order_number: orderNumber,
    ...orderData,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          tax: orderData.tax,
          total: orderData.total,
          payment_method: orderData.payment_method,
          cash_received: orderData.cash_received || 0,
          change_amount: orderData.change_amount || 0,
          cashier_name: orderData.cashier_name || 'Cashier 01'
        }])
        .select();

      if (!orderErr && dbOrder && dbOrder[0]) {
        const insertedOrderId = dbOrder[0].id;
        const orderItems = items.map(item => ({
          order_id: insertedOrderId,
          product_id: item.id.startsWith('prod-') ? null : item.id,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }));
        await supabase.from('order_items').insert(orderItems);

        // Update product stock in DB
        for (const item of items) {
          if (!item.id.startsWith('prod-')) {
            await updateProductStock(item.id, item.quantity);
          }
        }

        return { ...dbOrder[0], items };
      }
    } catch (err) {
      console.warn('Supabase create order failed, saving locally', err);
    }
  }

  // LocalStorage Fallback logic
  const localOrders = localStorage.getItem('sports_pos_orders');
  const orders = localOrders ? JSON.parse(localOrders) : [];
  const fullOrder = { ...finalOrder, items };
  orders.unshift(fullOrder);
  localStorage.setItem('sports_pos_orders', JSON.stringify(orders));

  // Deduct local stock
  for (const item of items) {
    await updateProductStock(item.id, item.quantity);
  }

  return fullOrder;
}

export async function fetchOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetch orders failed, using local orders', err);
    }
  }

  const local = localStorage.getItem('sports_pos_orders');
  return local ? JSON.parse(local) : [];
}
