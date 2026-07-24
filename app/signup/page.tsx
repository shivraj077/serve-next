'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
    };

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userEmail', data.email as string);
        localStorage.setItem('userPhone', data.phone as string);
        localStorage.setItem('userRole', 'user');
        Swal.fire({
          title: 'Welcome!',
          text: 'Account Created Successfully!',
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff',
          confirmButtonColor: 'var(--accent-primary)'
        });
        router.push('/dashboard');
      } else {
        Swal.fire({
          title: 'Signup Failed',
          text: result.message || 'Signup failed',
          icon: 'error',
          background: '#1a1b3a',
          color: '#fff'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during signup',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff'
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'google-user@example.com', firstName: 'Google', lastName: 'User', phone: '+91 9876543210' }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userRole', result.user.role);
        Swal.fire({
          title: 'Google Link',
          text: 'Google Account Linked successfully!',
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff'
        });
        router.push('/dashboard');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Social signup failed',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff'
      });
    }
  };

  const handleGithubSignup = async () => {
    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'github-user@example.com', firstName: 'Github', lastName: 'User', phone: '+91 9876543210' }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userRole', result.user.role);
        Swal.fire({
          title: 'GitHub Link',
          text: 'GitHub Account Linked successfully!',
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff'
        });
        router.push('/dashboard');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Social signup failed',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff'
      });
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />

      <section style={{
        padding: '8rem 0 6rem 0',
        background: 'radial-gradient(circle at 50% 0%, #1a1b3a 0%, #05060f 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div className="glass fade-in" style={{ padding: '3rem', borderRadius: '30px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Join ServNext and start your high-performance hosting journey</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
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
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
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
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Email Address</label>
                <input
                  name="email"
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Mobile Number 📱</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Password</label>
                <input
                  name="password"
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

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '2rem' }}>
                <input type="checkbox" id="terms" style={{ cursor: 'pointer', marginTop: '0.3rem' }} required />
                <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                  I agree to the <a href="#" style={{ color: 'var(--accent-primary)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</a>
                </label>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Create Account
              </button>

              <div style={{ textAlign: 'center', position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}></div>
                <span style={{ position: 'relative', zIndex: 2, background: '#0d0e24', padding: '0 1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>OR SIGN UP WITH</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="glass"
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" onClick={handleGithubSignup} className="glass" style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <svg width="20" height="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="white">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
