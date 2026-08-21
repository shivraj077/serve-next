import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, plan, userId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: 'Invalid order amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo12345';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'secret_demo12345';

    // Check if real key is configured (not default placeholder)
    const isPlaceholderKey =
      keyId.includes('51234567890123') ||
      keyId.includes('demo') ||
      keyId.includes('your_key_id_here') ||
      keySecret.includes('test_secret_key') ||
      keySecret.includes('your_razorpay_secret_here');

    if (!isPlaceholderKey) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const options = {
          amount: Math.round(Number(amount) * 100), // Amount in paise
          currency: 'INR',
          receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          notes: {
            plan: plan || 'VPS Plan',
            userId: userId || 'guest',
          },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: keyId,
        });
      } catch (sdkError: any) {
        console.warn(
          'Razorpay API auth failed with current keys, using Sandbox Order simulation:',
          sdkError?.message
        );
      }
    }

    // Fallback to Developer Sandbox / Test order for smooth UI testing
    const simulatedOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      orderId: simulatedOrderId,
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      keyId: keyId,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
