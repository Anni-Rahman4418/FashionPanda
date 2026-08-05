import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';

export const RetailerManager: React.FC = () => {
  const {
    products,
    deleteProduct,
    setEditingProduct,
    setIsProductFormOpen,
    currentUser
  } = useApp();

  const storeProducts = products.filter(p => p.retailerId === currentUser.id || currentUser.role === 'admin');

  const totalValue = storeProducts.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = storeProducts.filter(p => p.stock < 10).length;

  return (
    <div style={{ maxWidth: '1280px', margin: '32px auto', padding: '0 24px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Retailer Store Dashboard 🏪</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Managing catalog for: <strong style={{ color: 'var(--accent-pink)' }}>{currentUser.storeName || currentUser.name}</strong>
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsProductFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon /> Add New Product
        </button>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TOTAL LISTED ITEMS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{storeProducts.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ESTIMATED INVENTORY VALUE</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-pink)' }}>${totalValue.toFixed(2)}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>LOW STOCK WARNINGS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: lowStockCount > 0 ? '#f87171' : 'var(--accent-green)' }}>
            {lowStockCount} Items
          </div>
        </div>
      </div>

      {/* PRODUCT INVENTORY CRUD TABLE */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', fontWeight: 700 }}>
          Inventory Management (CRUD)
        </div>

        {storeProducts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No products listed in your store yet. Click "Add New Product" to create your first listing!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f7f7f9', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '14px 20px' }}>Product</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>Price</th>
                  <th style={{ padding: '14px 20px' }}>Stock</th>
                  <th style={{ padding: '14px 20px' }}>Delivery ETA</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions (CRUD)</th>
                </tr>
              </thead>
              <tbody>
                {storeProducts.map(prod => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={prod.imageUrl} alt={prod.name} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {prod.id}</div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge badge-purple">{prod.category}</span>
                    </td>

                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--accent-pink)' }}>
                      ${prod.price.toFixed(2)}
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: prod.stock < 10 ? '#f87171' : 'var(--accent-green)', fontWeight: 700 }}>
                        {prod.stock} units
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      ⚡ {prod.deliveryEtaMinutes} mins
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsProductFormOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          <EditIcon /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.name}"?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="btn btn-danger btn-sm"
                        >
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
