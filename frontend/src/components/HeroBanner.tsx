import React from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Streetwear', 'Formal', 'Casual', 'Accessories', 'Luxury', 'Footwear'];
export const HeroBanner: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

     
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
