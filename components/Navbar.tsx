'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const authStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(authStatus === 'true');
    setUserRole(localStorage.getItem('userRole'));

    // Listen for storage changes (for same-page updates if needed)
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('purchasedServer'); // Clear server details on logout
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    Swal.fire({
      title: 'Logged Out',
      text: 'Logged out successfully!',
      icon: 'info',
      background: '#1a1b3a',
      color: '#fff',
      timer: 1500,
      showConfirmButton: false
    });
    router.push('/');
    // Force a reload or update to ensure all components react
    window.location.reload();
  };
  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '1rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <span className="gradient-text">ServNext</span>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/#hosting" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Hosting</Link>
          <Link href="/#vps" style={{ fontSize: '0.9rem', fontWeight: '500' }}>VPS</Link>
          <Link href="/#support" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Support</Link>

          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <Link href="/admin" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00ff88', border: '1px solid #00ff88', padding: '0.3rem 0.8rem', borderRadius: '5px' }}>Admin Panel</Link>
              )}
              <Link href="/dashboard" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--accent-primary)' }}>Dashboard</Link>
              <button
                onClick={handleLogout}
                className="glass"
                style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', color: '#ff4b4b', fontWeight: '600' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Login</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
