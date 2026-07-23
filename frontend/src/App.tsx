import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerMarketplace } from './components/CustomerMarketplace';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { RetailerManager } from './components/RetailerManager';
import { AdminManager } from './components/AdminManager';

const MainContent: React.FC = () => {
  const { activeView, toast } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* NAVIGATION HEADER */}
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 200,
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(18, 18, 28, 0.95)',
            border: '1px solid var(--accent-pink)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <span>✨</span> {toast.message}
        </div>
      )}

      {/* MAIN VIEW SWITCHER */}
      <main style={{ flex: 1 }}>
        {activeView === 'retailer' ? (
          <RetailerManager />
        ) : activeView === 'admin' ? (
          <AdminManager />
        ) : (
          <CustomerMarketplace />
        )}
      </main>

      {/* FOOTER */}
      <footer className="glass" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🐼</span>
            <span className="font-serif" style={{ fontWeight: 800, fontSize: '1.2rem' }}>FashionPanda</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Connecting local apparel boutiques with stylish customers through 60-minute express local delivery.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            © {new Date().getFullYear()} FashionPanda Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* OVERLAY MODALS & DRAWERS */}
      <ProductFormModal />
      <ProductDetailModal />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
