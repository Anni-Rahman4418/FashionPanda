import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, UserIcon, TruckIcon } from './Icons';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    currentUser,
    registerUser,
    orders,
    setActiveOrder,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'register'>('profile');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'customer' | 'retailer' | 'admin'>('customer');

  if (!isAuthOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser({
      name: regName,
      email: regEmail,
      role: regRole,
      address: '100 Express Way, Zone 4'
    });
    setActiveTab('profile');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserIcon className="text-gradient" />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Account & Orders</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as {currentUser.name}</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={() => setIsAuthOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <button
            className="btn btn-sm"
            style={{
              background: activeTab === 'profile' ? 'var(--accent-pink)' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'profile' ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button
            className="btn btn-sm"
            style={{
              background: activeTab === 'orders' ? 'var(--accent-pink)' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'orders' ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => setActiveTab('orders')}
          >
            Orders History ({orders.length})
          </button>
          <button
            className="btn btn-sm"
            style={{
              background: activeTab === 'register' ? 'var(--accent-pink)' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'register' ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => setActiveTab('register')}
          >
            New Account
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{currentUser.email}</div>
              <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>
                Role: {currentUser.role}
              </span>
            </div>

            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>PRESET PROFILE SWITCHER</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => switchRole('customer')}>
                Customer Demo
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => switchRole('retailer')}>
                Retailer Store
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => switchRole('admin')}>
                Admin Control
              </button>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No orders placed yet.</p>
            ) : (
              orders.map(ord => (
                <div
                  key={ord.id}
                  className="glass-card"
                  style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => {
                    setActiveOrder(ord);
                    setIsAuthOpen(false);
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TruckIcon style={{ color: 'var(--accent-cyan)' }} /> {ord.id}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ord.items.length} item(s) • Total: ${ord.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <span className="badge badge-express">
                    {ord.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* REGISTER TAB */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Anni Rahman"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="anni@fashionpanda.com"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Account Role</label>
              <select
                className="form-select"
                value={regRole}
                onChange={e => setRegRole(e.target.value as any)}
              >
                <option value="customer">Customer</option>
                <option value="retailer">Retailer Boutique Owner</option>
                <option value="admin">Platform Administrator</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Account & Log In
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
