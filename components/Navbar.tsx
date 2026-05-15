'use client';
import Link from 'next/link';

export default function Navbar() {
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
          <Link href="#hosting" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Hosting</Link>
          <Link href="#vps" style={{ fontSize: '0.9rem', fontWeight: '500' }}>VPS</Link>
          <Link href="#support" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Support</Link>
          <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Login</Link>
        </div>
      </div>
    </nav>
  );
}
