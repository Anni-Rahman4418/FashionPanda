import React from 'react';
import { useApp, ActiveViewMode } from '../context/AppContext';
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
    setIsOrderTrackerOpen,
    setIsProductFormOpen,
    setEditingProduct,
    activeView,
    setActiveView,
    isBackendOnline
  } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 90, borderBottom: '1px solid var(--ink)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setActiveView('marketplace'); setSearchQuery(''); }}>
          <PandaIcon className="w-8 h-8" />
          <span className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Fashion<span className="text-gradient">Panda</span>
          </span>
        </div>

        {/* VIEW NAVIGATION TABS */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f4f4f7', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          {[
            { id: 'marketplace', label: '🛍️ Shop Catalog' },
            { id: 'retailer', label: '🏪 Retailer Portal' },
            { id: 'admin', label: '🛡️ Admin Dashboard' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as ActiveViewMode)}
              className="btn btn-sm"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                background: activeView === tab.id ? 'var(--accent-pink)' : 'transparent',
                color: activeView === tab.id ? '#fff' : 'var(--text-muted)',
                border: 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH BAR (Marketplace View) */}
        {activeView === 'marketplace' && (
          <div style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '44px', borderRadius: 'var(--radius-full)', background: '#f4f4f7', border: '1px solid var(--border-glass)' }}
              placeholder="Search fashion items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* ACTIONS & ROLE SWITCHER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Add Product Button (Visible in Retailer / Admin Views) */}
          {(activeView === 'retailer' || activeView === 'admin') && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductFormOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <PlusIcon /> Add Item
            </button>
          )}

          {/* Active Order Tracker Button */}
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
              onClick={() => setIsOrderTrackerOpen(true)}
            >
              <TruckIcon style={{ color: 'var(--accent-cyan)' }} />
              <div style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Track Order</span>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{activeOrder.status}</div>
              </div>
            </div>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
            title="Shopping Bag"
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

          {/* Profile / Account Drawer */}
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
