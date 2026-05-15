'use client';
import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 80,
    features: ['4 vCPU Cores', '8GB RAM', '200GB NVMe SSD', '10TB Bandwidth', 'Daily Backups', 'Free SSL', '24/7 Support'],
    recommended: false
  },
  {
    name: 'Professional',
    monthlyPrice: 150,
    features: ['8 vCPU Cores', '16GB RAM', '500GB NVMe SSD', 'Unlimited Bandwidth', 'Hourly Backups', 'Snapshots', 'Priority Support'],
    recommended: true
  },
  {
    name: 'Pro Plus',
    monthlyPrice: 250,
    features: ['16 vCPU Cores', '32GB RAM', '1TB NVMe SSD', 'Unlimited Bandwidth', 'DDoS Protection', 'Dedicated IP', 'Advanced Security'],
    recommended: false
  },
  {
    name: 'Enterprise',
    monthlyPrice: 450,
    features: ['32 vCPU Cores', '64GB RAM', '2TB NVMe SSD', 'Unlimited Bandwidth', 'Managed Support', 'WAF Protection', 'Dedicated Account Manager'],
    recommended: false
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="vps" style={{ padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">High-Performance <span className="gradient-text">Enterprise VPS</span></h2>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem',
            marginTop: '-1rem'
          }}>
            <span style={{ color: !isYearly ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              style={{
                width: '60px',
                height: '30px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '30px',
                position: 'relative',
                border: '1px solid var(--card-border)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                background: 'var(--accent-primary)',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: isYearly ? '32px' : '3px',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }} />
            </button>
            <span style={{ color: isYearly ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
              Yearly <span style={{ 
                fontSize: '0.7rem', 
                background: 'var(--success)', 
                padding: '2px 8px', 
                borderRadius: '10px',
                marginLeft: '5px',
                color: 'black',
                fontWeight: '800'
              }}>SAVE 20%</span>
            </span>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {plans.map((plan, index) => {
            const isHovered = hoveredIndex === index;
            const isRecommended = plan.recommended;
            const monthlyPrice = plan.monthlyPrice;
            const yearlyPriceMonthly = Math.round(monthlyPrice * 0.8);
            const totalYearly = yearlyPriceMonthly * 12;

            return (
              <div 
                key={index} 
                className="glass"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  padding: '2.5rem 1.5rem',
                  borderRadius: '24px',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: (isHovered || isRecommended) ? '2px solid var(--accent-primary)' : '1px solid var(--card-border)',
                  transform: (isHovered || isRecommended) ? 'translateY(-10px) scale(1.02)' : 'none',
                  zIndex: (isHovered || isRecommended) ? 10 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered ? '0 20px 40px rgba(99, 102, 241, 0.2)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div>
                  {(isRecommended || isHovered) && (
                    <span style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: isHovered ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}>
                      {isHovered ? 'SELECT THIS PLAN' : 'BEST VALUE'}
                    </span>
                  )}
                  
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', transition: 'all 0.3s ease', color: isHovered ? 'var(--accent-primary)' : 'white' }}>{plan.name}</h3>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
                      {isYearly && (
                        <span style={{ 
                          fontSize: '1.2rem', 
                          color: 'rgba(255,255,255,0.3)', 
                          textDecoration: 'line-through' 
                        }}>
                          ${monthlyPrice}
                        </span>
                      )}
                      <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        ${isYearly ? yearlyPriceMonthly : monthlyPrice}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>/mo</span>
                    </div>
                    {isYearly && (
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--success)', 
                        marginTop: '8px',
                        fontWeight: '600'
                      }}>
                        ${totalYearly} billed annually
                      </div>
                    )}
                  </div>
                  
                  <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2rem' }}>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{ 
                        marginBottom: '0.7rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        opacity: isHovered ? 1 : 0.8
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link 
                  href={`/checkout?plan=${plan.name}&price=${isYearly ? yearlyPriceMonthly : monthlyPrice}&billing=${isYearly ? 'yearly' : 'monthly'}`}
                  style={{ width: '100%' }}
                >
                  <button 
                    className={(isRecommended || isHovered) ? 'btn-primary' : 'glass'} 
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem', 
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      background: isHovered ? 'linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))' : undefined
                    }}
                  >
                    {isHovered ? 'Select Plan' : 'Get Started'}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
