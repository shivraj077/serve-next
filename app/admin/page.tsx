'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

export default function AdminPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');

    if (authStatus !== 'true' || role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchAllServers = async () => {
      try {
        const res = await fetch('/api/admin/servers');
        const data = await res.json();
        if (res.ok) {
          setServers(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllServers();
  }, [router]);

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const result = await Swal.fire({
      title: 'Change User Role?',
      text: `Do you want to change this user's role to ${newRole.toUpperCase()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent-primary)',
      cancelButtonColor: '#d33',
      background: '#1a1b3a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      if (res.ok) {
        Swal.fire({
          title: 'Updated!',
          text: 'Role updated successfully!',
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff'
        });
        // Refresh the list
        const res2 = await fetch('/api/admin/servers');
        const data = await res2.json();
        setServers(data);
      } else {
        Swal.fire({
          title: 'Failed',
          text: 'Failed to update role',
          icon: 'error',
          background: '#1a1b3a',
          color: '#fff'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Error updating role',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff'
      });
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to permanently delete ${name}? All their servers will be removed!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4b4b',
      cancelButtonColor: 'rgba(255,255,255,0.1)',
      confirmButtonText: 'Yes, Delete!',
      background: '#1a1b3a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/users/delete?userId=${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        Swal.fire({
          title: 'Deleted!',
          text: 'User and all data removed successfully.',
          icon: 'success',
          background: '#1a1b3a',
          color: '#fff'
        });
        // Refresh the list
        const res2 = await fetch('/api/admin/servers');
        const data = await res2.json();
        setServers(data);
      } else {
        Swal.fire({
          title: 'Failed',
          text: 'Failed to delete user',
          icon: 'error',
          background: '#1a1b3a',
          color: '#fff'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Error deleting user',
        icon: 'error',
        background: '#1a1b3a',
        color: '#fff'
      });
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '10rem' }}>Loading Admin Dashboard...</div>;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />
      
      <section style={{ padding: '8rem 0 4rem 0' }}>
        <div className="container">
          <div className="glass fade-in" style={{ padding: '3rem', borderRadius: '24px', marginBottom: '3rem', border: '1px solid var(--accent-primary)' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Admin <span className="gradient-text">Dashboard</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Overlooking all server deployments and customer purchases.</p>
          </div>

          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '2rem' }}>All Purchased Servers</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Plan</th>
                  <th style={{ padding: '1rem' }}>Qty</th>
                  <th style={{ padding: '1rem' }}>Duration</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{s.userId?.firstName} {s.userId?.lastName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{s.userId?.email}</div>
                        </div>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px', 
                          background: s.userId?.role === 'admin' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {s.userId?.role?.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{s.plan}</td>
                    <td style={{ padding: '1rem' }}>{s.quantity}</td>
                    <td style={{ padding: '1rem' }}>{s.duration}y</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>${s.price}</td>
                    <td style={{ padding: '1rem' }}>{new Date(s.purchaseDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(0,255,136,0.1)', color: 'var(--success)', fontSize: '0.8rem' }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleRoleUpdate(s.userId?._id, s.userId?.role)}
                        className="glass"
                        style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '8px', 
                          color: 'var(--accent-primary)',
                          border: '1px solid var(--accent-primary)',
                          marginRight: '0.5rem'
                        }}
                      >
                        Change Role
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(s.userId?._id, s.userId?.firstName)}
                        className="glass"
                        style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '8px', 
                          color: '#ff4b4b',
                          border: '1px solid #ff4b4b'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {servers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>No servers purchased yet.</div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
