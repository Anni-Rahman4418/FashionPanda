import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrashIcon, PlusIcon } from './Icons';
import { UserRole } from '../types';

export const AdminManager: React.FC = () => {
  const { users, deleteUser, updateUser, products, orders, registerUser } = useApp();

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('customer');

  const totalRevenue = orders.reduce((acc, o) => o.status !== 'Cancelled' ? acc + o.totalAmount : acc, 0);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    await registerUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      address: '742 Fashion St, Zone 1'
    });
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '32px auto', padding: '0 24px' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Platform Control Center 🛡️</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage users, products, order fulfillment, and system metrics</p>
      </div>

      {/* SYSTEM METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>REGISTERED USERS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{users.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TOTAL PRODUCTS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-pink)' }}>{products.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TOTAL ORDERS PLACED</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{orders.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PLATFORM GROSS VOLUME</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* ADD USER FORM (CREATE USER) */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>Create New User Account (User CRUD)</h3>
        <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
              placeholder="sarah@example.com"
            />
          </div>

          <div>
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value as UserRole)}
            >
              <option value="customer">Customer</option>
              <option value="retailer">Retailer</option>
              <option value="admin">Admin</option>
              <option value="courier">Courier</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <PlusIcon /> Add User
          </button>
        </form>
      </div>

      {/* USER MANAGEMENT CRUD TABLE */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', fontWeight: 700 }}>
          User Accounts Management Table
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f7f7f9', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '14px 20px' }}>User ID</th>
                <th style={{ padding: '14px 20px' }}>Name</th>
                <th style={{ padding: '14px 20px' }}>Email</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
                <th style={{ padding: '14px 20px' }}>Joined</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>{u.id}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>{u.name}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{u.email}</td>
                  
                  <td style={{ padding: '14px 20px' }}>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                      value={u.role}
                      onChange={e => updateUser(u.id, { role: e.target.value as UserRole })}
                    >
                      <option value="customer">Customer</option>
                      <option value="retailer">Retailer</option>
                      <option value="admin">Admin</option>
                      <option value="courier">Courier</option>
                    </select>
                  </td>

                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>{u.createdAt}</td>

                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete user "${u.name}"?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="btn btn-danger btn-sm"
                      title="Delete User"
                    >
                      <TrashIcon /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
