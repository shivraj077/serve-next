'use client';

export default function Footer() {
  return (
    <footer style={{ padding: '4rem 0 2rem 0', borderTop: '1px solid var(--card-border)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>ServNext</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              Providing premium VPS hosting solutions with unmatched performance and security since 2024.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Hosting</h4>
            <ul style={{ listStyle: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Shared Hosting</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">VPS Hosting</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Cloud Hosting</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">WordPress Hosting</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">About Us</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Contact</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Privacy Policy</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Help Center</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Tutorials</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Status</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#">Live Chat</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.85rem'
        }}>
          © 2026 ServNext. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
