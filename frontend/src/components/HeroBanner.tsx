import React from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Streetwear', 'Formal', 'Casual', 'Accessories', 'Luxury', 'Footwear'];
const TICKER_ITEMS = ['NEW DROPS WEEKLY', 'EXPRESS 45–60 MIN', 'LOCAL BOUTIQUES ONLY', 'FREE 30-DAY RETURNS', 'VERIFIED RETAILERS'];

export const HeroBanner: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

      {/* SCROLLING BOUTIQUE-WINDOW TICKER */}
      <div
        style={{
          marginTop: '20px',
          overflow: 'hidden',
          borderTop: '1px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '8px 0',
        }}
      >
        <div className="marquee-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              {item} <span style={{ color: 'var(--accent-pink)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* EDITORIAL HERO */}
      <div
        style={{
          padding: '56px 0 40px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'end',
          borderBottom: '1px solid var(--border-glass)'
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-pink)',
              marginBottom: '14px'
            }}
          >
            Issue No. 01 — The Express Edit
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: 'var(--ink)'
            }}
          >
            Boutique fashion,
            <br />
            on your doorstep <span style={{ color: 'var(--accent-pink)', fontStyle: 'italic' }}>fast.</span>
          </h1>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '28px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '18px', lineHeight: 1.6 }}>
            We courier runway pieces, streetwear grails, and local designer boutique stock straight to your door — usually inside the hour.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent-pink)' }}>—</span> Real-time courier tracking
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent-pink)' }}>—</span> Every retailer verified by hand
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '20px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginRight: '4px', whiteSpace: 'nowrap' }}>
          BROWSE
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="btn btn-sm"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: selectedCategory === cat ? 'var(--ink)' : '#fffdfb',
              color: selectedCategory === cat ? '#fffdfb' : 'var(--text-muted)',
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
