import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, StarIcon, ShoppingBagIcon, TruckIcon } from './Icons';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductDetail, setSelectedProductDetail, addToCart, setIsCartOpen } = useApp();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!selectedProductDetail) return null;
  const p = selectedProductDetail;

  const currentSize = selectedSize || p.sizes[0] || 'M';
  const currentColor = selectedColor || p.colors[0] || 'Default';

  const handleBuyNow = () => {
    addToCart(p, currentSize, currentColor, quantity);
    setSelectedProductDetail(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProductDetail(null)}>
      <div
        className="modal-content animate-fade-in"
        style={{ maxWidth: '850px', padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}>
          
          {/* IMAGE PREVIEW */}
          <div style={{ position: 'relative', background: '#000' }}>
            <img
              src={p.imageUrl}
              alt={p.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
              <span className="badge badge-express">⚡ {p.deliveryEtaMinutes} MIN EXPRESS</span>
            </div>
          </div>

          {/* DETAILS */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-purple">{p.category}</span>
                <button className="btn btn-secondary btn-icon" onClick={() => setSelectedProductDetail(null)}>
                  <CloseIcon />
                </button>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>{p.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                  <StarIcon fill="var(--accent-gold)" /> <span style={{ marginLeft: '4px', fontWeight: 700 }}>{p.rating}</span>
                </div>
                <span style={{ color: 'var(--text-dim)' }}>|</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Store: {p.retailerName}</span>
              </div>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-pink)', marginBottom: '16px' }}>
                ${p.price.toFixed(2)}
                {p.originalPrice && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-dim)', textDecoration: 'line-through', marginLeft: '10px' }}>
                    ${p.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                {p.description}
              </p>

              {/* SIZES */}
              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">SELECT SIZE:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="btn btn-sm"
                      style={{
                        background: currentSize === size ? 'var(--accent-pink)' : '#f4f4f7',
                        color: currentSize === size ? '#fff' : 'var(--text-main)',
                        border: currentSize === size ? 'none' : '1px solid var(--border-glass)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLORS */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">COLOR:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="btn btn-sm"
                      style={{
                        background: currentColor === color ? 'var(--accent-purple)' : '#f4f4f7',
                        color: currentColor === color ? '#fff' : 'var(--text-main)',
                        border: currentColor === color ? 'none' : '1px solid var(--border-glass)'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <TruckIcon style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  In Stock: <strong style={{ color: 'var(--accent-green)' }}>{p.stock} units</strong> at store
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => addToCart(p, currentSize, currentColor, quantity)}
                  className="btn btn-secondary"
                >
                  <ShoppingBagIcon /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn btn-primary">
                  Express Checkout ⚡
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
