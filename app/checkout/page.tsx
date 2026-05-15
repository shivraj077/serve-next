'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'Professional';
  const pricePerMonth = searchParams.get('price') || '150';
  const billing = searchParams.get('billing') || 'monthly';
  
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const basePrice = (billing === 'yearly' ? parseInt(pricePerMonth) * 12 : parseInt(pricePerMonth)) * quantity;
  
  // Apply duration discounts (5% for 2 years, 10% for 3 years)
  const durationDiscount = duration === 2 ? 0.95 : duration === 3 ? 0.9 : 1;
  const totalPrice = Math.round(basePrice * duration * durationDiscount);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
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
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Password</label>
                          <input 
                            type="password" 
                            required 
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }}
                            placeholder="••••••••"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  <h2 style={{ marginBottom: '1.5rem' }}>Payment Method</h2>
                  <form onSubmit={handleNext}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                      <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--accent-primary)' }}>Credit Card</div>
                      <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '12px', textAlign: 'center', opacity: 0.5 }}>PayPal</div>
                      <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '12px', textAlign: 'center', opacity: 0.5 }}>Crypto</div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>Card Number</label>
                      <input 
                        type="text" 
                        required 
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white' }}
                        placeholder="0000 0000 0000 0000"
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
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
                      <span style={{ fontWeight: 'bold' }}>{formData.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Payment:</span>
                      <span style={{ fontWeight: 'bold' }}>Card ending in {formData.cardNumber.slice(-4) || 'XXXX'}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '1.2rem' }} 
                    onClick={async () => {
                      const serverData = {
                        userId: localStorage.getItem('userId'),
                        plan: plan,
                        quantity: quantity,
                        duration: duration,
                        price: totalPrice,
                      };

                      try {
                        const res = await fetch('/api/servers', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(serverData),
                        });

                        if (res.ok) {
                          Swal.fire({
                            title: 'Order Placed!',
                            text: 'Your VPS instance is being provisioned.',
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
                      }
                    }}
                  >
                    Complete Purchase (${totalPrice})
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
                  <span style={{ fontWeight: 'bold' }}>${pricePerMonth}/mo</span>
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
                      onClick={() => setQuantity(Math.min(2, quantity + 1))}
                      style={{ width: '25px', height: '25px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Duration</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {[1, 2, 3].map((y) => (
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

                <div style={{ borderTop: '1px solid var(--card-border)', margin: '1rem 0', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Total Amount</span>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>${totalPrice}</span>
                  </div>
                  {billing === 'yearly' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--success)', textAlign: 'right', fontWeight: '600' }}>
                      Billed annually (You saved 20%)
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                      Billed monthly
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '2.5rem', lineHeight: '1.5' }}>
                Secure SSL Checkout. Your data is encrypted and protected. No hidden fees.
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
