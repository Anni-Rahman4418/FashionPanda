import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { RetailerManager } from './components/RetailerManager';
import { AdminManager } from './components/AdminManager';
import { SearchIcon } from './components/Icons';

const MainContent: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    selectedCategory,
    searchQuery,
    currentUser,
    toast
  } = useApp();

  // Filter products by category and search query
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.retailerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* NAVIGATION BAR */}
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

      {/* CONDITIONAL RENDER BASED ON ACTIVE ROLE */}
      {currentUser.role === 'retailer' ? (
        <RetailerManager />
      ) : currentUser.role === 'admin' ? (
        <AdminManager />
      ) : (
        <main style={{ flex: 1 }}>
          <HeroBanner />

          {/* MAIN PRODUCT CATALOG GRID */}
          <section style={{ maxWidth: '1280px', margin: '36px auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                  {selectedCategory === 'All' ? 'Boutique Express Catalog' : `${selectedCategory} Collection`}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {filteredProducts.length} local fashion items ready for 60-minute express courier delivery
                </p>
              </div>
            </div>

            {isLoadingProducts ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <div className="animate-spin" style={{ fontSize: '2rem', marginBottom: '12px' }}>🐼</div>
                Loading luxury catalog...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <SearchIcon style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: 'var(--accent-pink)' }} />
                <h3>No fashion items found</h3>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                  Try adjusting your search filters or browse other categories.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

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

      {/* MODALS */}
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
