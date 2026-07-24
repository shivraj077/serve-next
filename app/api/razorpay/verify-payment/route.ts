import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      serverData,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { message: 'Missing Razorpay payment verification parameters' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'secret_demo12345';
    const isSimulatedOrder = razorpay_order_id.startsWith('order_test_');

    if (!isSimulatedOrder) {
      // Verify Razorpay HMAC SHA256 signature for live / actual test API orders
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return NextResponse.json(
          { message: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // Save server order to MongoDB
    await dbConnect();

    const server = await Server.create({
      userId: serverData.userId,
      plan: serverData.plan || 'Professional',
      quantity: serverData.quantity || 1,
      duration: serverData.duration || 1,
      price: serverData.price || 0,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentStatus: 'Paid',
      status: 'Running',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified & server provisioned successfully!',
      server,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
