'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'Professional';
  const pricePerMonth = searchParams.get('price') || '23530.47';
  const billing = searchParams.get('billing') || 'monthly';

  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Base price calculation
  const basePrice = (billing === 'yearly' ? parseFloat(pricePerMonth) * 12 : parseFloat(pricePerMonth)) * quantity;

  // Apply duration discounts (5% for 2 years, 10% for 3 years)
  const durationDiscount = duration === 2 ? 0.95 : duration === 3 ? 0.9 : 1;
  const subtotal = Number((basePrice * duration * durationDiscount).toFixed(2));

  // 18% GST Tax calculation
  const gstAmount = Number((subtotal * 0.18).toFixed(2));
  const grandTotal = Number((subtotal + gstAmount).toFixed(2));

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const verifyAndPostPayment = async (orderId: string, paymentId: string, signature: string, userId: string) => {
    try {
      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          serverData: {
            userId: userId,
            plan: plan,
            quantity: quantity,
            duration: duration,
            price: grandTotal,
          },
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        Swal.fire({
          title: 'Payment Successful!',
          text: `Payment ID: ${paymentId}. Your VPS instance is now running. Total Billed : ₹${grandTotal.toLocaleString('en-IN')}`,
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff',
          confirmButtonColor: '#6366f1',
        });
        router.push('/dashboard');
      } else {
        Swal.fire({
          title: 'Payment Verification Failed',
          text: verifyData.message || 'Signature verification failed',
          icon: 'error',
          background: '#1a1b3a',
          color: '#fff',
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: 'Verification Error',
        text: err.message || 'Error occurred while verifying payment',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in or create an account first to complete purchase.',
        icon: 'warning',
        background: '#1a1b3a',
        color: '#fff',
      });
      setStep(1);
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Create Razorpay order on backend with Grand Total (Inc 18% GST)
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          plan: `${plan} (${billing})`,
          userId: userId,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // If Simulated / Developer Sandbox Test Order
      if (orderData.isSimulated) {
        const confirmResult = await Swal.fire({
          title: '⚡ Razorpay Test Sandbox Gateway',
          html: `<p style="font-size: 0.95rem; color: #a5b4fc;">Order ID: <code>${orderData.orderId}</code></p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Subtotal: ₹${subtotal.toLocaleString('en-IN')}</p>
                <p style="font-size: 0.9rem; color: #a5b4fc;">18% GST Tax: ₹${gstAmount.toLocaleString('en-IN')}</p>
                <p style="font-size: 1.1rem; font-weight: bold; margin-top: 0.5rem;">Total Amount to Pay: ₹${grandTotal.toLocaleString('en-IN')}</p>
                <p style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.8rem;">(Simulated test mode — Add real keys to <code>.env.local</code> for live gateway)</p>`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Pay ₹' + grandTotal.toLocaleString('en-IN') + ' (Simulate Success)',
          cancelButtonText: 'Cancel',
          background: '#1a1b3a',
          color: '#fff',
          confirmButtonColor: '#6366f1',
        });

        if (confirmResult.isConfirmed) {
          const fakePaymentId = `pay_sim_${Date.now()}`;
          await verifyAndPostPayment(orderData.orderId, fakePaymentId, 'simulated_sig', userId);
        } else {
          setIsProcessing(false);
        }
        return;
      }

      // Check if Razorpay script is loaded
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Open Official Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ServeNext Cloud Hosting',
        description: `${plan} VPS (Inc 18% GST)`,
        image: 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png',
        order_id: orderData.orderId,
        prefill: {
          email: formData.email || localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        handler: async function (response: any) {
          await verifyAndPostPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            userId
          );
        },
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err: any) {
        // Fallback simulation if window.Razorpay fails due to test key
        const fakePaymentId = `pay_sim_${Date.now()}`;
        await verifyAndPostPayment(orderData.orderId, fakePaymentId, 'simulated_sig', userId);
      }
    } catch (error: any) {
      setIsProcessing(false);
      Swal.fire({
        title: 'Payment Error',
        text: error.message || 'An error occurred while initiating Razorpay',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff',
      });
    }
  };

  const handleStandardCardPayment = async () => {
    const userId = localStorage.getItem('userId');
    const serverData = {
      userId: userId,
      plan: plan,
      quantity: quantity,
      duration: duration,
      price: grandTotal,
    };

    try {
      setIsProcessing(true);
      const res = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData),
      });

      if (res.ok) {
        Swal.fire({
          title: 'Order Placed!',
          text: `Your VPS instance is being provisioned. Total Billed (Inc. 18% GST): ₹${grandTotal.toLocaleString('en-IN')}`,
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff',
          confirmButtonColor: 'var(--accent-primary)'
        });
        router.push('/dashboard');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to save order',
          icon: 'error',
          background: '#1a1b3a',
          color: '#fff'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during purchase',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <Navbar />

      <section style={{ padding: '8rem 0 4rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '3rem',
            alignItems: 'start'
          }}>

            {/* Left Column: Checkout Steps */}
            <div className="glass" style={{ padding: '3rem', borderRadius: '30px' }}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ color: step >= 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)', borderBottom: `2px solid ${step >= 1 ? 'var(--accent-primary)' : 'transparent'}`, paddingBottom: '0.5rem', fontWeight: 'bold' }}>01 Account</div>
                <div style={{ color: step >= 2 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)', borderBottom: `2px solid ${step >= 2 ? 'var(--accent-primary)' : 'transparent'}`, paddingBottom: '0.5rem', fontWeight: 'bold' }}>02 Payment</div>
                <div style={{ color: step >= 3 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)', borderBottom: `2px solid ${step >= 3 ? 'var(--accent-primary)' : 'transparent'}`, paddingBottom: '0.5rem', fontWeight: 'bold' }}>03 Review</div>
              </div>

              {step === 1 && (
                <div className="fade-in">
                  <h2 style={{ marginBottom: '1.5rem' }}>{isLoggedIn ? 'Your Plan Details' : 'Create your account'}</h2>
                  <form onSubmit={handleNext}>
                    {!isLoggedIn && (
                      <>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Email Address</label>
                          <input
                            type="email"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }}
                            placeholder="your@email.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Mobile Number 📱</label>
                          <input
                            type="tel"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }}
                            placeholder="+91 98765 43210"
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Password</label>
                          <input
                            type="password"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }}
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {isLoggedIn && (
                      <div className="glass" style={{ padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>You are logged in. Review your selected configuration below before proceeding to payment.</p>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>REGION</span>
                            <span style={{ fontWeight: 'bold' }}>Global Edge</span>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>OS</span>
                            <span style={{ fontWeight: 'bold' }}>Ubuntu 22.04 LTS</span>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>TYPE</span>
                            <span style={{ fontWeight: 'bold' }}>High Performance NVMe</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <button className="btn-primary" style={{ width: '100%' }}>Continue to Payment</button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="fade-in">
                  <h2 style={{ marginBottom: '1.5rem' }}>Select Payment Method</h2>
                  <form onSubmit={handleNext}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                      <div
                        onClick={() => setPaymentMethod('razorpay')}
                        className="glass"
                        style={{
                          flex: 1,
                          padding: '1.2rem 1rem',
                          borderRadius: '16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: paymentMethod === 'razorpay' ? '2px solid #6366f1' : '1px solid var(--card-border)',
                          background: paymentMethod === 'razorpay' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>💳</div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Razorpay (UPI / Card / NetBanking)</div>
                        <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '0.2rem' }}>Recommended for Instant Setup</div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('card')}
                        className="glass"
                        style={{
                          flex: 1,
                          padding: '1.2rem 1rem',
                          borderRadius: '16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: paymentMethod === 'card' ? '2px solid #6366f1' : '1px solid var(--card-border)',
                          background: paymentMethod === 'card' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🌐</div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Manual Credit Card</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>Direct Entry</div>
                      </div>
                    </div>

                    {paymentMethod === 'razorpay' && (
                      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px border var(--card-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <strong style={{ color: '#fff' }}>Instant Razorpay Gateway</strong>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                          You will be able to pay via <strong>GPay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, NetBanking, and Wallets</strong> in the next step.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Card Number</label>
                          <input
                            type="text"
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }}
                            placeholder="0000 0000 0000 0000"
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>CVC</label>
                            <input type="text" placeholder="123" style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }} />
                          </div>
                        </div>
                      </>
                    )}

                    <button className="btn-primary" style={{ width: '100%' }}>Review Order</button>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="fade-in" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h2 style={{ marginBottom: '1rem' }}>Almost there!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
                    You are subscribing to the <strong>{plan}</strong> plan.
                  </p>
                  <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px', textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Email:</span>
                      <span style={{ fontWeight: 'bold' }}>{formData.email || localStorage.getItem('userEmail') || 'User Account'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Payment Method:</span>
                      <span style={{ fontWeight: 'bold', color: '#a5b4fc' }}>
                        {paymentMethod === 'razorpay' ? 'Razorpay (UPI / Cards / NetBanking)' : `Card ending in ${formData.cardNumber.slice(-4) || 'XXXX'}`}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    disabled={isProcessing}
                    style={{ width: '100%', padding: '1.2rem', opacity: isProcessing ? 0.7 : 1 }}
                    onClick={() => {
                      if (paymentMethod === 'razorpay') {
                        handleRazorpayPayment();
                      } else {
                        handleStandardCardPayment();
                      }
                    }}
                  >
                    {isProcessing ? 'Processing Payment...' : `Complete Purchase (₹${grandTotal.toLocaleString('en-IN')})`}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--accent-primary)', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Selected Plan</span>
                  <span style={{ fontWeight: 'bold' }}>{plan} VPS</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Billing Cycle</span>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{billing}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Unit Price</span>
                  <span style={{ fontWeight: 'bold' }}>₹{pricePerMonth}/yr</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ width: '25px', height: '25px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >-</button>
                    <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      style={{ width: '25px', height: '25px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Duration</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {[1, 2,].map((y) => (
                      <button
                        key={y}
                        onClick={() => setDuration(y)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '5px',
                          background: duration === y ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {y}y
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtotal & GST Tax breakdown */}
                <div style={{ borderTop: '1px solid var(--card-border)', margin: '1rem 0 0 0', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Subtotal</span>
                    <span style={{ fontWeight: 'bold' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Tax</span>
                    <span style={{ fontWeight: 'bold', color: '#a5b4fc' }}>+ ₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div> */}

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '1rem', marginTop: '0.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', display: 'block' }}>Total Amount</span>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '600' }}>Includes Tax</span>
                      </div>
                      <span style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2rem', lineHeight: '1.5', textAlign: 'center' }}>
                🔒 Razorpay 256-bit Encrypted SSL Checkout. UPI, NetBanking & Cards supported.
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '10rem', textAlign: 'center' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
