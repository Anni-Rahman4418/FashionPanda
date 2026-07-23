import React from 'react';
import { useApp } from '../context/AppContext';
import { PandaIcon, SearchIcon, ShoppingBagIcon, UserIcon, TruckIcon, PlusIcon } from './Icons';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    searchQuery,
    setSearchQuery,
    cart,
    setIsCartOpen,
    activeOrder,
    setIsAuthOpen,
    setIsProductFormOpen,
    setEditingProduct
  } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 90, borderBottom: '1px solid var(--border-glass)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setSearchQuery('')}>
          <PandaIcon className="w-8 h-8" />
          <div>
            <span className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Fashion<span className="text-gradient">Panda</span>
            </span>
            <span className="badge badge-express" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>
              ⚡ 60m Express
            </span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '44px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)' }}
            placeholder="Search luxury streetwear, velvet suits, shoes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ACTIONS & ROLE SWITCHER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Quick Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
            {(['customer', 'retailer', 'admin'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className="btn btn-sm"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: currentUser.role === role ? 'var(--accent-pink)' : 'transparent',
                  color: currentUser.role === role ? '#fff' : 'var(--text-muted)',
                  border: 'none'
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Create Product Button (Visible to Retailer & Admin) */}
          {(currentUser.role === 'retailer' || currentUser.role === 'admin') && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductFormOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <PlusIcon /> Add Product
            </button>
          )}

          {/* Active Order Button */}
          {activeOrder && (
            <div
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                borderColor: 'var(--accent-cyan)'
              }}
              onClick={() => setIsAuthOpen(true)}
            >
              <TruckIcon style={{ color: 'var(--accent-cyan)' }} />
              <div style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Order Track</span>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{activeOrder.status}</div>
              </div>
            </div>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
          >
            <ShoppingBagIcon />
            {totalCartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-pink)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Modal */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)' }}
          >
            <UserIcon />
            <span style={{ fontSize: '0.85rem' }}>{currentUser.name.split(' ')[0]}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
