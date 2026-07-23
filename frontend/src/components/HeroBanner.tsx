import React from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Streetwear', 'Formal', 'Casual', 'Accessories', 'Luxury', 'Footwear'];

export const HeroBanner: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '24px auto 0', padding: '0 24px' }}>
      
      {/* HERO BANNER CARD */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          padding: '48px 40px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '260px',
          background: 'linear-gradient(135deg, rgba(255, 42, 117, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(18, 18, 28, 0.9) 100%)',
          border: '1px solid rgba(255, 42, 117, 0.25)'
        }}
      >
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-express">🛵 EXPRESS DELIVERY</span>
            <span className="badge badge-hot">🔥 NEW DROPS</span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '12px' }}>
            Local Boutique Fashion <br />
            <span className="text-gradient">Delivered in 60 Mins.</span>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px' }}>
            Shop runway collections, streetwear Grails, and curated local designer boutiques with instant door-to-door express courier delivery.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-pink)', fontSize: '1.2rem' }}>✓</span> Real-Time Order Map Tracking
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-purple)', fontSize: '1.2rem' }}>✓</span> Verified Retailer Stock
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem' }}>✓</span> 30-Day Instant Returns
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '8px' }}>
          Categories:
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="btn btn-sm"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: selectedCategory === cat ? 'var(--accent-pink)' : 'rgba(255,255,255,0.06)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
              border: selectedCategory === cat ? 'none' : '1px solid var(--border-glass)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
