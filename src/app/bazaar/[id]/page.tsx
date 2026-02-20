'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { DB_ID, PRODUCTS_COL } from '@/lib/collections';
import { useParams } from 'next/navigation';
import Badge from '@/components/Badge';
import Link from 'next/link';
import { Product } from '@/components/ProductCard';

const mockProducts: Record<string, Product & { description: string }> = {
    p1: { $id: 'p1', name: 'Bamboo Wind Chimes', category: 'bamboo_crafts', price: 850, artisan_name: 'Ramesh Bhil', artisan_verified: true, district: 'Banswara', description: 'Handcrafted bamboo wind chimes with natural dyes. Each piece is unique, made using traditional Bhil weaving techniques passed down over generations. The bamboo is sourced sustainably from forests around Banswara.', images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=700&h=500&fit=crop', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=500&fit=crop'] },
    p2: { $id: 'p2', name: 'Warli Village Painting', category: 'warli', price: 2400, artisan_name: 'Sunita Gamit', artisan_verified: true, district: 'Dungarpur', description: 'An intricate Warli painting depicting a harvest festival scene set in Vagad. Painted on handmade khadi paper using traditional rice-paste pigments mixed with earthen colors.', images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&h=500&fit=crop'] },
    p3: { $id: 'p3', name: 'Terracotta Tribal Vase', category: 'terracotta', price: 1200, artisan_name: 'Mohanlal Vasave', artisan_verified: false, district: 'Banswara', description: 'Hand-thrown terracotta vase with tribal motifs etched into the clay before firing. Fired in a traditional kiln using firewood gathered from the Banswara forests.', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&h=500&fit=crop'] },
    p4: { $id: 'p4', name: 'Sandstone Deity Carving', category: 'stone_carvings', price: 5500, artisan_name: 'Devji Katara', artisan_verified: true, district: 'Dungarpur', description: 'Exquisite sandstone carving of Goddess Tripura Sundari. Traditional Vagad stone-carving style from Dungarpur, using locally quarried sandstone with inherent red-gold hues.', images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&h=500&fit=crop'] },
};

const categoryLabel: Record<string, string> = {
    bamboo_crafts: 'Bamboo Crafts', stone_carvings: 'Stone Carvings', textiles: 'Tribal Textiles', warli: 'Warli Paintings', terracotta: 'Terracotta',
};

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<(Product & { description?: string }) | null>(null);
    const [activeImg, setActiveImg] = useState(0);
    const [ordered, setOrdered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const doc = await databases.getDocument(DB_ID, PRODUCTS_COL, id);
                setProduct(doc as unknown as Product);
            } catch {
                setProduct(mockProducts[id] ?? mockProducts['p1']);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid var(--bg)', borderTop: '4px solid var(--primary)', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!product) return <div style={{ textAlign: 'center', padding: '5rem' }}>Product not found.</div>;

    const images = product.images?.length ? product.images : [`https://picsum.photos/seed/${id}/700/500`];

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Breadcrumb */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 1.5rem' }}>
                <div className="container-custom" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link href="/bazaar" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Bhil Bazaar</Link>
                    <span>›</span>
                    <span>{product.name}</span>
                </div>
            </div>

            <div className="container-custom" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

                    {/* Image Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ borderRadius: '1.25rem', overflow: 'hidden', height: 400, background: '#e5e0d8' }}>
                            <img src={images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {images.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 56, borderRadius: '0.5rem', overflow: 'hidden', border: i === activeImg ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', padding: 0 }}>
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <p style={{ color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                                {categoryLabel[product.category] ?? product.category}
                            </p>
                            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--text-dark)', lineHeight: 1.2 }}>{product.name}</h1>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {product.artisan_verified && <Badge variant="verified">Govt. Verified Artisan</Badge>}
                            {product.district && <Badge variant="district">{product.district}</Badge>}
                        </div>

                        <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: 'var(--primary)' }}>
                            ₹{product.price.toLocaleString('en-IN')}
                        </p>

                        {product.description && (
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.97rem', borderLeft: '3px solid var(--accent)', paddingLeft: '1rem' }}>
                                {(product as { description?: string }).description}
                            </p>
                        )}

                        {/* Artisan */}
                        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                                {product.artisan_name[0]}
                            </div>
                            <div>
                                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--primary)' }}>{product.artisan_name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Master Artisan · {product.district}</p>
                            </div>
                        </div>

                        {/* How it works */}
                        <div style={{ background: '#fef7f0', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(224,112,80,0.15)' }}>
                            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>📦 Click & Collect Model</p>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Place your order online. Collect it in-person from the artisan during your Vagad visit — or choose home delivery within 7–10 days.</p>
                        </div>

                        {/* CTA */}
                        {ordered ? (
                            <div style={{ background: '#dcfce7', border: '1px solid #4ade80', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#15803d', fontSize: '1.1rem' }}>Order Placed!</p>
                                <p style={{ color: '#166534', fontSize: '0.9rem' }}>You'll receive artisan contact details on your email.</p>
                            </div>
                        ) : (
                            <button
                                className="btn-accent"
                                onClick={() => setOrdered(true)}
                                style={{ padding: '1rem 2rem', fontSize: '1.05rem', justifyContent: 'center' }}
                            >
                                🛒 Click & Collect
                            </button>
                        )}

                        <button className="btn-outline" style={{ justifyContent: 'center' }}>💬 Message Artisan</button>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
