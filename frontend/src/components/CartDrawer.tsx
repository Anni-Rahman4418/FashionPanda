import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, TrashIcon, ShoppingBagIcon } from './Icons';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const deliveryFee = cart.length > 0 ? 4.99 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryFee + tax;

  return (
    <>
      <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setIsCartOpen(false)}>
        <div
          className="modal-content animate-fade-in"
          style={{
            maxWidth: '450px',
            height: '100vh',
            maxHeight: '100vh',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* HEADER */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBagIcon className="text-gradient" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Your Fashion Bag</h2>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsCartOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            {/* CART ITEMS LIST */}
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '6px' }}>Your bag is empty</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Explore boutique drops and express local delivery items!
                </p>
                <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto', paddingRight: '4px' }}>
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="glass-card"
                    style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>{item.product.name}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-pink)' }}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                            className="btn btn-secondary"
                            style={{ width: '24px', height: '24px', padding: 0 }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                            className="btn btn-secondary"
                            style={{ width: '24px', height: '24px', padding: 0 }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="btn btn-danger btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      title="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER & CHECKOUT */}
          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Express Courier Fee (60m)</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                  <span>Grand Total</span>
                  <span className="text-gradient">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={clearCart}>
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  Checkout ⚡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
    </>
  );
};
