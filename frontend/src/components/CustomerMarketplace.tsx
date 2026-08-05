import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { SearchIcon, ShoppingBagIcon, TruckIcon } from './Icons';

export const CustomerMarketplace: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cart,
    setIsCartOpen,
    activeOrder
  } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products by active category and search input
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.retailerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* HERO PROMO BANNER */}
      <HeroBanner />

      {/* QUICK STATS & PROMO HIGHLIGHTS */}
      <section style={{ maxWidth: '1280px', margin: '24px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              🛍️
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Curated Designer Drops</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Streetwear, formal suits & luxury silk</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              🔄
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Instant Courier Returns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try on at home with free 30-day returns</div>
            </div>
          </div>

        </div>
      </section>

      {/* CATALOG SEARCH & HEADER */}
      <section style={{ maxWidth: '1280px', margin: '36px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {selectedCategory === 'All' ? 'Explore Local Fashion Drops' : `${selectedCategory} Collection`}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {filteredProducts.length} local items available for express delivery
            </p>
          </div>

          {/* QUICK FLOATING CART PERK */}
          {totalCartCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-primary"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <ShoppingBagIcon /> View Bag ({totalCartCount} items)
            </button>
          )}
        </div>

        {/* PRODUCT CARDS GRID */}
        {isLoadingProducts ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <div className="animate-spin" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🐼</div>
            Loading luxury fashion marketplace...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <SearchIcon style={{ width: '44px', height: '44px', margin: '0 auto 12px', color: 'var(--accent-pink)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No fashion items found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '6px', marginBottom: '16px' }}>
              We couldn't find items matching "{searchQuery}".
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
