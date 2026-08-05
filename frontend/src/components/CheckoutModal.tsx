import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { CloseIcon, CheckIcon, TruckIcon } from './Icons';

export const CheckoutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, createOrder, setIsAuthOpen } = useApp();
  const [address, setAddress] = useState(currentUser.address || '742 Evergreen Terrace, Soho District');
  const [phone, setPhone] = useState('+1 (555) 392-1029');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createOrder(paymentMethod, address, phone);
      onClose();
      setIsAuthOpen(true); // Open live tracker overview
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '550px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Panda Express Checkout ⚡</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guaranteed delivery within 60 minutes</p>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <input
              type="text"
              required
              className="form-input"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Building, street, apartment unit"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Recipient Phone Number</label>
            <input
              type="text"
              required
              className="form-input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {(['Credit Card', 'Apple Pay', 'Panda Wallet', 'Cash on Delivery'] as const).map(method => (
                <div
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMethod === method ? '1px solid var(--accent-pink)' : '1px solid var(--border-glass)',
                    background: paymentMethod === method ? 'rgba(255,42,117,0.15)' : '#f7f7f9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <span>{method}</span>
                  {paymentMethod === method && <CheckIcon style={{ color: 'var(--accent-pink)' }} />}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TruckIcon style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Order will be dispatched instantly from nearby boutique partner stores.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ minWidth: '160px' }}>
              {isSubmitting ? 'Dispatching...' : 'Place Order 💳'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
