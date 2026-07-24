'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [servers, setServers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Route Protection: Redirect if not logged in
    const authStatus = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    if (authStatus !== 'true' || !userId) {
      router.push('/login');
      return;
    }

    const fetchServers = async () => {
      try {
        const res = await fetch(`/api/servers?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setServers(data);
        }
      } catch (err) {
        console.error('Failed to fetch servers');
      }
    };

    fetchServers();
  }, [router]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />

      <section style={{ padding: '8rem 0 4rem 0' }}>
        <div className="container">
          <div className="glass fade-in" style={{ padding: '3rem', borderRadius: '24px', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to your <span className="gradient-text">Dashboard</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Manage your high-performance VPS instances and cloud services from here.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Active Instances</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{servers.length}</div>

              {servers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  {servers.map((server: any, idx: number) => (
                    <div key={idx} className="fade-in" style={{ textAlign: 'left', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>PLAN</span>
                        <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{server.plan} VPS</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>STATUS</span>
                        <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem' }}>● {server.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>PURCHASED</span>
                        <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{new Date(server.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>You have no active servers. Deploy your first instance today!</p>
              )}

              <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                {servers.length > 0 ? 'Manage All Instances' : 'Deploy New Server'}
              </button>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Account Balance</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>$0.00</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Current balance in your ServNext wallet.</p>
              <button className="glass" style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem', borderRadius: '8px' }}>Add Funds</button>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>Quick Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Uptime</span>
                  <span style={{ color: 'var(--success)' }}>99.99%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Support Tickets</span>
                  <span>0 Open</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Data Usage</span>
                  <span>0 GB / 5 TB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
