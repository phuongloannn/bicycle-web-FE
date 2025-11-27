import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { OrderStatus } from '@/types/order';

const poolConfig = {
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'sms_demo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await mysql.createConnection(poolConfig);

    const orderId = params.id;
    const body = await request.json();

    console.log('Raw Request Body:', JSON.stringify(body, null, 2));
    console.log('Order ID:', orderId);

    if (!body) {
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: 'No data provided' 
      }, { status: 400 });
    }

    const updateData: Record<string, any> = {};

    if (body.status) updateData.status = body.status;
    if (body.shipping_address) updateData.shipping_address = body.shipping_address;
    if (body.billing_address) updateData.billing_address = body.billing_address;
    if (body.is_paid !== undefined) {
      updateData.is_paid = body.is_paid ? 1 : 0;
      updateData.paid_at = body.is_paid ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
    }

    console.log('Processed Update Data:', JSON.stringify(updateData, null, 2));

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        error: 'No valid update fields', 
        details: 'All update fields are undefined' 
      }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const updateFields = Object.keys(updateData)
      .map(key => `${key} = ?`)
      .join(', ');
    const updateValues = [...Object.values(updateData), orderId];

    const query = `
      UPDATE orders 
      SET ${updateFields}
      WHERE id = ?
    `;

    console.log('SQL Query:', query);
    console.log('Query Values:', updateValues);

    await connection.execute(query, updateValues);

    const [rows] = await connection.execute(
      `SELECT * FROM orders WHERE id = ?`, 
      [orderId]
    );

    const updatedOrder = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!updatedOrder) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error('Detailed Error Updating Order:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}