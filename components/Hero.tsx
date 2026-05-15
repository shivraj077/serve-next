'use client';

export default function Hero() {
  return (
    <section style={{
      padding: '10rem 0 6rem 0',
      background: 'radial-gradient(circle at 50% -20%, #2d1b69 0%, #05060f 60%)',
      textAlign: 'center'
    }}>
      <div className="container fade-in">
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Next-Generation <br />
          <span className="gradient-text">VPS Hosting</span> Solutions
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          Experience lightning-fast performance, enterprise-grade security, and 99.9% uptime with ServNext. Scalable infrastructure for your growing business.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#vps" className="btn-primary" style={{ fontSize: '1.1rem' }}>Get Started Now</a>
          <a href="#features" className="glass" style={{ padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: '600' }}>View Features</a>
        </div>
        
        <div style={{ marginTop: '5rem' }} className="float">
          <div className="glass" style={{
            maxWidth: '1000px',
            margin: '0 auto',
            borderRadius: '24px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <img 
              src="/dashboard-preview.png" 
              alt="ServNext Dashboard Preview" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
