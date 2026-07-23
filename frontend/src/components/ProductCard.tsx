import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { StarIcon, ShoppingBagIcon, EditIcon, TrashIcon } from './Icons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    currentUser,
    addToCart,
    deleteProduct,
    setEditingProduct,
    setIsProductFormOpen,
    setSelectedProductDetail
  } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');

  const isOwnerOrAdmin = currentUser.role === 'admin' || (currentUser.role === 'retailer' && currentUser.id === product.retailerId);

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* BADGES */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
        {product.isExpress && <span className="badge badge-express">⚡ {product.deliveryEtaMinutes}m</span>}
        {product.originalPrice && <span className="badge badge-hot">SALE</span>}
      </div>

      {/* CRUD ACTION OVERLAY FOR RETAILERS / ADMINS */}
      {isOwnerOrAdmin && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
          <button
            onClick={e => {
              e.stopPropagation();
              setEditingProduct(product);
              setIsProductFormOpen(true);
            }}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px', background: 'rgba(15, 15, 24, 0.85)' }}
            title="Edit Product"
          >
            <EditIcon />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                deleteProduct(product.id);
              }
            }}
            className="btn btn-danger btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Delete Product"
          >
            <TrashIcon />
          </button>
        </div>
      )}

      {/* PRODUCT IMAGE */}
      <div
        style={{ width: '100%', height: '260px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
        onClick={() => setSelectedProductDetail(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 12px',
            background: 'linear-gradient(to top, rgba(10,10,16,0.9), transparent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🏪 {product.retailerName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
            <StarIcon /> {product.rating}
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', cursor: 'pointer', lineHeight: 1.3 }}
          onClick={() => setSelectedProductDetail(product)}
        >
          {product.name}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', flex: 1, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>

        {/* SIZE SELECTOR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>SIZE:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  borderRadius: '4px',
                  border: selectedSize === size ? '1px solid var(--accent-pink)' : '1px solid var(--border-glass)',
                  background: selectedSize === size ? 'rgba(255,42,117,0.2)' : 'transparent',
                  color: selectedSize === size ? 'var(--accent-pink)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE & ADD TO CART */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through', marginLeft: '6px' }}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, selectedSize, product.colors[0] || 'Default', 1)}
            className="btn btn-primary btn-sm"
          >
            <ShoppingBagIcon /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
