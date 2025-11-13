// src/app/api/cart/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { guestCarts } from "../data";
import mysql from 'mysql2/promise';

// ✅ Tạo connection pool với config từ env
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sms_demo',
  connectionLimit: 10,
});

export async function POST(request: NextRequest) {
  let connection;
  try {
    const sessionId = request.headers.get('X-Session-ID');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // ✅ Lấy thông tin sản phẩm thực từ database
    connection = await pool.getConnection();
    
    const [products] = await connection.execute(
      `SELECT id, name, price, stock, quantity, category, image_url 
       FROM products WHERE id = ?`,
      [productId]
    );

    const product = (products as any[])[0];
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('📦 [API] Product from database:', {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url
    });

    // ✅ Khởi tạo giỏ hàng nếu chưa có
    if (!guestCarts[sessionId]) {
      guestCarts[sessionId] = { items: [], total: 0, itemCount: 0 };
    }

    const cart = guestCarts[sessionId];

    // ✅ Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.items.find((item: any) => item.productId === productId);

    if (existingItem) {
      // Cập nhật số lượng nếu đã có
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      // ✅ Sử dụng thông tin thực từ database
      const newItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name, // ← Tên thực từ database
        quantity,
        price: parseFloat(product.price), // ← Giá thực từ database
        total: parseFloat(product.price) * quantity,
        image: product.image_url || '/images/placeholder-product.jpg', // ← Ảnh thực từ database
        stock: product.stock || product.quantity // ← Stock thực từ database
      };
      
      console.log('🛒 [API] New cart item with real data:', newItem);
      cart.items.push(newItem);
    }

    // ✅ Recalc tổng
    cart.total = cart.items.reduce((sum: number, item: any) => sum + item.total, 0);
    cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    console.log('💰 [API] Cart updated:', {
      sessionId,
      total: cart.total,
      itemCount: cart.itemCount,
      items: cart.items
    });

    return NextResponse.json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
      sessionId,
      data: cart
    });

  } catch (error) {
    console.error("❌ [API] Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}