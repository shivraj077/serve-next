'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login Successful! Redirecting to Dashboard...');
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />
      
      <section style={{ 
        padding: '10rem 0 6rem 0',
        background: 'radial-gradient(circle at 50% 0%, #1a1b3a 0%, #05060f 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container" style={{ maxWidth: '450px' }}>
          <div className="glass fade-in" style={{ padding: '3rem', borderRadius: '30px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Enter your credentials to access your VPS dashboard</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--card-border)',
                    color: 'white',
                    outline: 'none',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Password</label>
                  <a href="#" style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--card-border)',
                    color: 'white',
                    outline: 'none',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
                <label htmlFor="remember" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Remember me for 30 days</label>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Sign In
              </button>

              <div style={{ textAlign: 'center', position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}></div>
                <span style={{ position: 'relative', zIndex: 2, background: '#0d0e24', padding: '0 1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>OR CONTINUE WITH</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="glass" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <span>Google</span>
                </button>
                <button type="button" className="glass" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <span>GitHub</span>
                </button>
              </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              Don't have an account? <Link href="/checkout" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Create one</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
