import Link from 'next/link';
import Badge from './Badge';

export interface Product {
    $id: string;
    name: string;
    category: string;
    price: number;
    artisan_name: string;
    artisan_verified?: boolean;
    images?: string[];
    district?: string;
    description?: string;
}

const categoryEmoji: Record<string, string> = {
    bamboo_crafts: '🎋',
    stone_carvings: '🗿',
    textiles: '🧵',
    warli: '🎨',
    terracotta: '🏺',
};

const categoryLabel: Record<string, string> = {
    bamboo_crafts: 'Bamboo Crafts',
    stone_carvings: 'Stone Carvings',
    textiles: 'Tribal Textiles',
    warli: 'Warli Paintings',
    terracotta: 'Terracotta',
};

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const emoji = categoryEmoji[product.category] ?? '🛍️';
    const label = categoryLabel[product.category] ?? product.category;
    const img = product.images?.[0] ?? `https://picsum.photos/seed/${product.$id}/400/300`;

    return (
        <Link href={`/bazaar/${product.$id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img
                        src={img}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Outfit, sans-serif', color: 'var(--primary)' }}>
                            {emoji} {label}
                        </span>
                    </div>
                    {product.district && (
                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                            <Badge variant="district">{product.district}</Badge>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                        {product.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        by {product.artisan_name}
                    </p>
                    {product.artisan_verified && (
                        <div style={{ marginBottom: '0.75rem' }}>
                            <Badge variant="verified">Govt. Verified Artisan</Badge>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <button className="btn-accent" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                            Click & Collect
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
