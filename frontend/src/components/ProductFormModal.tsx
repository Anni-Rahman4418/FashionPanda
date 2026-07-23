import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { CloseIcon } from './Icons';

export const ProductFormModal: React.FC = () => {
  const {
    isProductFormOpen,
    setIsProductFormOpen,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    currentUser
  } = useApp();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    category: Product['category'];
    imageUrl: string;
    stock: number;
    retailerName: string;
    sizes: string;
    colors: string;
    deliveryEtaMinutes: number;
    isExpress: boolean;
  }>({
    name: '',
    description: '',
    price: 99.99,
    originalPrice: 0,
    category: 'Streetwear',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    retailerName: currentUser.storeName || 'Panda Fashion Boutique',
    sizes: 'S, M, L, XL',
    colors: 'Black, White, Neon',
    deliveryEtaMinutes: 45,
    isExpress: true
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice || 0,
        category: editingProduct.category,
        imageUrl: editingProduct.imageUrl,
        stock: editingProduct.stock,
        retailerName: editingProduct.retailerName,
        sizes: editingProduct.sizes.join(', '),
        colors: editingProduct.colors.join(', '),
        deliveryEtaMinutes: editingProduct.deliveryEtaMinutes,
        isExpress: editingProduct.isExpress
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 89.00,
        originalPrice: 0,
        category: 'Streetwear',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        stock: 15,
        retailerName: currentUser.storeName || 'Panda Fashion Boutique',
        sizes: 'S, M, L, XL',
        colors: 'Black, Charcoal',
        deliveryEtaMinutes: 30,
        isExpress: true
      });
    }
  }, [editingProduct, currentUser]);

  if (!isProductFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice > 0 ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      imageUrl: formData.imageUrl,
      stock: Number(formData.stock),
      retailerId: currentUser.id,
      retailerName: formData.retailerName,
      sizes: sizesArray.length > 0 ? sizesArray : ['M', 'L'],
      colors: colorsArray.length > 0 ? colorsArray : ['Black'],
      rating: editingProduct ? editingProduct.rating : 5.0,
      deliveryEtaMinutes: Number(formData.deliveryEtaMinutes),
      isExpress: formData.isExpress
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }

    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsProductFormOpen(false)}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {editingProduct ? 'Edit Catalog Product' : 'Add New Fashion Product'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {editingProduct ? `Updating SKU: ${editingProduct.id}` : 'List an item for 60-minute local express delivery'}
            </p>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={() => setIsProductFormOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Name / Title</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vintage Leather Biker Jacket"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="Streetwear">Streetwear</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Accessories">Accessories</option>
                <option value="Luxury">Luxury</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Retailer Shop Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.retailerName}
                onChange={e => setFormData({ ...formData, retailerName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-input"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original MSRP Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                placeholder="Optional list price"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery ETA (Minutes)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.deliveryEtaMinutes}
                onChange={e => setFormData({ ...formData, deliveryEtaMinutes: parseInt(e.target.value) || 30 })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Image URL</label>
              <input
                type="url"
                required
                className="form-input"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sizes (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={formData.sizes}
                onChange={e => setFormData({ ...formData, sizes: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Colors (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={formData.colors}
                onChange={e => setFormData({ ...formData, colors: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Description</label>
              <textarea
                rows={3}
                required
                className="form-textarea"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe material, fit, craftsmanship..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsProductFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
