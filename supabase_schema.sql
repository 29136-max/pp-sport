-- ==============================================================================
-- SPORTS EQUIPMENT POS (ระบบ POS ร้านขายอุปกรณ์กีฬา) - SUPABASE SQL SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ==============================================================================

-- 1. Create Tables

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Dumbbell',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (Sports Equipment)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    cost_price NUMERIC(10, 2) DEFAULT 0 CHECK (cost_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    image_url TEXT,
    brand TEXT DEFAULT 'Generic',
    size TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'promptpay', 'card')),
    cash_received NUMERIC(10, 2) DEFAULT 0,
    change_amount NUMERIC(10, 2) DEFAULT 0,
    cashier_name TEXT DEFAULT 'Cashier 01',
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Line Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (RLS) - Enable public read/write access for POS operational ease
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access to categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow public full access to products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public full access to orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public full access to order_items" ON public.order_items FOR ALL USING (true);

-- 3. Initial Seed Data (Sports Equipment Catalog)

INSERT INTO public.categories (id, name, slug, icon) VALUES
  ('11111111-1111-1111-1111-111111111111', 'ฟุตบอล (Football)', 'football', 'CircleDot'),
  ('22222222-2222-2222-2222-222222222222', 'แบดมินตัน (Badminton)', 'badminton', 'Zap'),
  ('33333333-3333-3333-3333-333333333333', 'บาสเกตบอล (Basketball)', 'basketball', 'Circle'),
  ('44444444-4444-4444-4444-444444444444', 'วิ่ง & รองเท้า (Running & Shoes)', 'running', 'Footprints'),
  ('55555555-5555-5555-5555-555555555555', 'ฟิตเนส (Fitness)', 'fitness', 'Dumbbell'),
  ('66666666-6666-6666-6666-666666666666', 'ว่ายน้ำ (Swimming)', 'swimming', 'Waves'),
  ('77777777-7777-7777-7777-777777777777', 'วอลเลย์บอล (Volleyball)', 'volleyball', 'Trophy')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, category_id, category_name, price, cost_price, stock, sku, barcode, image_url, brand, size) VALUES
  ('ลูกฟุตบอล Molten Vantaggio 5000 (FIFA Quality)', '11111111-1111-1111-1111-111111111111', 'ฟุตบอล (Football)', 1890.00, 1200.00, 25, 'FB-MOL-5000', '885123450001', 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&auto=format&fit=crop&q=80', 'Molten', 'Size 5'),
  ('ลูกฟุตบอล Nike Flight Official Match', '11111111-1111-1111-1111-111111111111', 'ฟุตบอล (Football)', 4500.00, 3100.00, 12, 'FB-NKE-FLT', '885123450002', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80', 'Nike', 'Size 5'),
  ('ไม้แบดมินตัน Yonex Astrox 99 Pro', '22222222-2222-2222-2222-222222222222', 'แบดมินตัน (Badminton)', 6490.00, 4800.00, 10, 'BD-YNX-AX99', '885123450003', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80', 'Yonex', '4U/G5'),
  ('ลูกขนไก่ Yonex AS-30 (กล่อง 12 ลูก)', '22222222-2222-2222-2222-222222222222', 'แบดมินตัน (Badminton)', 980.00, 750.00, 45, 'BD-YNX-AS30', '885123450004', 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?w=600&auto=format&fit=crop&q=80', 'Yonex', 'Standard'),
  ('ลูกบาสเกตบอล Spalding TF-1000 Legacy', '33333333-3333-3333-3333-333333333333', 'บาสเกตบอล (Basketball)', 2990.00, 1950.00, 18, 'BK-SPL-1000', '885123450005', 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&auto=format&fit=crop&q=80', 'Spalding', 'Size 7'),
  ('รองเท้าวิ่ง Nike Vaporfly 3 Racing', '44444444-4444-4444-4444-444444444444', 'วิ่ง & รองเท้า (Running & Shoes)', 8500.00, 6200.00, 8, 'RN-NKE-VP3', '885123450006', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', 'Nike', 'US 10 / EU 44'),
  ('รองเท้าวิ่ง Adidas Ultraboost Light', '44444444-4444-4444-4444-444444444444', 'วิ่ง & รองเท้า (Running & Shoes)', 7000.00, 5000.00, 14, 'RN-ADI-UBL', '885123450007', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80', 'Adidas', 'US 9.5 / EU 43'),
  ('ดัมเบลปรับน้ำหนักได้ Bowflex SelectTech (คู่)', '55555555-5555-5555-5555-555555555555', 'ฟิตเนส (Fitness)', 12900.00, 9200.00, 5, 'FT-BWF-552', '885123450008', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80', 'Bowflex', '24kg Pair'),
  ('เสื่อโยคะลูเลมอน Lululemon Reversible Mat 5mm', '55555555-5555-5555-5555-555555555555', 'ฟิตเนส (Fitness)', 2850.00, 1800.00, 20, 'FT-LUL-MAT', '885123450009', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80', 'Lululemon', '5mm Pink/Black'),
  ('แว่นตาว่ายน้ำ Speedo Fastskin Hyper Elite', '66666666-6666-6666-6666-666666666666', 'ว่ายน้ำ (Swimming)', 2190.00, 1400.00, 30, 'SW-SPD-HYP', '885123450010', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop&q=80', 'Speedo', 'One Size'),
  ('ลูกวอลเลย์บอล Mikasa V200W Official Match Ball', '77777777-7777-7777-7777-777777777777', 'วอลเลย์บอล (Volleyball)', 2650.00, 1800.00, 16, 'VB-MKS-V200', '885123450011', 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&auto=format&fit=crop&q=80', 'Mikasa', 'Size 5')
ON CONFLICT (sku) DO NOTHING;
