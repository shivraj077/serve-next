'use client';

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'CEO at TechFlow',
    content: 'ServNext has been a game-changer for our infrastructure. The speed and reliability are unmatched in the industry.',
    initials: 'AJ',
    color: '#6366f1'
  },
  {
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    content: 'The NVMe SSD storage makes a huge difference. My applications load twice as fast compared to my previous host.',
    initials: 'SC',
    color: '#a855f7'
  },
  {
    name: 'Michael Smith',
    role: 'E-commerce Owner',
    content: 'Customer support is incredible. They helped me migrate my entire site in less than an hour with zero downtime.',
    initials: 'MS',
    color: '#ec4899'
  }
];

export default function Testimonials() {
  return (
    <section style={{ padding: '6rem 0', background: 'var(--background)' }}>
      <div className="container">
        <h2 className="section-title">Trusted by <span className="gradient-text">thousands</span> of users</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {testimonials.map((t, i) => (
            <div key={i} className="glass" style={{
              padding: '2.5rem',
              borderRadius: '24px',
              position: 'relative',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: t.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                fontSize: '1.2rem',
                boxShadow: `0 0 20px ${t.color}44`
              }}>
                {t.initials}
              </div>
              
              <p style={{ fontStyle: 'italic', marginBottom: '2rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                "{t.content}"
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{t.role}</div>
                </div>
              </div>

              {/* Decorative Quote Icon */}
              <div style={{ position: 'absolute', top: '2rem', right: '2rem', opacity: 0.05 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21V13.5C14.017 10.4624 16.4795 8 19.517 8H20.017V10H19.517C17.584 10 16.017 11.567 16.017 13.5V16M3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21ZM3 21V13.5C3 10.4624 5.46244 8 8.5 8H9V10H8.5C6.567 10 5 11.567 5 13.5V16" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
