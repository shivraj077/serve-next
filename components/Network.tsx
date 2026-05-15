'use client';

export default function Network() {
  return (
    <section style={{ padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Global <span className="gradient-text">Network Infrastructure</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>
            Our strategically located data centers ensure low latency and high availability for your users, no matter where they are in the world.
          </p>
        </div>
        
        <div className="glass" style={{
          borderRadius: '30px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
        }}>
          <img 
            src="/network-map.png" 
            alt="Global Network Map" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '1rem 2rem',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>25+</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Locations</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>100+</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Tbps Capacity</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-tertiary)' }}>99.9%</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
