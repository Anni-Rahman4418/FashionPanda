import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { CloseIcon, TruckIcon, CheckIcon } from './Icons';

const ORDER_STAGES: OrderStatus[] = [
  'Placed',
  'Accepted',
  'Packing',
  'Courier Picked Up',
  'On The Way',
  'Delivered'
];

export const OrderTrackerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeOrder, orders, setActiveOrder, updateOrderStatus, cancelOrder, currentUser } = useApp();

  if (!activeOrder && orders.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Place an order to track delivery status!</p>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const order = activeOrder || orders[0];
  const currentStageIndex = ORDER_STAGES.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TruckIcon style={{ color: 'var(--accent-cyan)' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Order Tracker ({order.id})</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ETA: <strong style={{ color: 'var(--accent-cyan)' }}>{order.estimatedDeliveryTime}</strong> | Placed: {order.createdAt}
            </p>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* ORDER SELECTOR TAB IF MULTIPLE */}
        {orders.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
            {orders.map(o => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className="btn btn-sm"
                style={{
                  background: order.id === o.id ? 'var(--accent-purple)' : '#f4f4f7',
                  color: order.id === o.id ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {o.id} ({o.status})
              </button>
            ))}
          </div>
        )}

        {/* STATUS STEP PROGRESS BAR */}
        {isCancelled ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: '#f87171', marginBottom: '4px' }}>Order Cancelled</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This order was cancelled and refunded.</p>
          </div>
        ) : (
          <div style={{ marginBottom: '32px', position: 'relative', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {ORDER_STAGES.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isCurrent
                          ? 'var(--accent-pink)'
                          : isPassed
                          ? 'var(--accent-cyan)'
                          : '#eceef1',
                        color: isPassed ? '#000' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        marginBottom: '8px',
                        boxShadow: isCurrent ? '0 0 15px rgba(255,42,117,0.6)' : 'none',
                        transition: 'var(--transition)'
                      }}
                    >
                      {isPassed ? <CheckIcon style={{ width: '16px', height: '16px' }} /> : idx + 1}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--accent-pink)' : isPassed ? 'var(--text-main)' : 'var(--text-dim)' }}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ORDER DETAILS & COURIER */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>DELIVERY RECIPIENT</h4>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{order.userName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.userAddress}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>📞 {order.userPhone}</div>
          </div>

          <div className="glass-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>PANDA COURIER</h4>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>🛵 {order.courierName || 'Assigned Express Rider'}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', marginTop: '4px' }}>📞 {order.courierPhone}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Payment: {order.paymentMethod}</div>
          </div>
        </div>

        {/* ORDERED ITEMS */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>ITEMS IN THIS ORDER</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7f7f9', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem' }}>
                  {item.quantity}x <strong>{item.product.name}</strong> ({item.selectedSize} / {item.selectedColor})
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-pink)' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER UPDATE / CANCEL CRUD ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount: </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>${order.totalAmount.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Status updates for Admin / Retailer */}
            {(currentUser.role === 'admin' || currentUser.role === 'retailer') && !isCancelled && (
              <select
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                value={order.status}
                onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
              >
                {ORDER_STAGES.map(st => (
                  <option key={st} value={st}>Set Status: {st}</option>
                ))}
              </select>
            )}

            {/* Cancel order button if pending */}
            {!isCancelled && order.status !== 'Delivered' && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    cancelOrder(order.id);
                  }
                }}
              >
                Cancel Order
              </button>
            )}

            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
