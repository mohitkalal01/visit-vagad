import Link from 'next/link';
import Badge from './Badge';

export interface Stay {
    $id: string;
    name: string;
    location: string;
    district?: string;
    host_name?: string;
    paryatan_mitra_level?: number;
    rips_certified?: boolean;
    price_per_night: number;
    rating?: number;
    review_count?: number;
    images?: string[];
    type?: string;
    distance_from_landmark?: string;
}

const typeLabel: Record<string, string> = {
    farm_stay: '🌾 Farm Stay',
    heritage_home: '🏛️ Heritage Home',
    eco_hut: '🌿 Eco Hut',
};

interface Props {
    stay: Stay;
}

export default function StayCard({ stay }: Props) {
    const img = stay.images?.[0] ?? `https://picsum.photos/seed/stay-${stay.$id}/400/300`;
    const typeStr = stay.type ? (typeLabel[stay.type] ?? stay.type) : '🏡 Homestay';

    return (
        <Link href={`/stays/${stay.$id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img
                        src={img}
                        alt={stay.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Outfit, sans-serif', color: 'var(--primary-dark)' }}>
                            {typeStr}
                        </span>
                    </div>
                    {stay.rating && (
                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.65)', color: 'white', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            ⭐ {stay.rating.toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                        {stay.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        📍 {stay.location}
                        {stay.distance_from_landmark && <span style={{ fontSize: '0.78rem' }}>· {stay.distance_from_landmark}</span>}
                    </p>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {stay.rips_certified && <Badge variant="rips">RIPS 2024 Certified</Badge>}
                        {stay.paryatan_mitra_level && <Badge variant="paryatan">Paryatan Mitra L{stay.paryatan_mitra_level}</Badge>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                                ₹{stay.price_per_night.toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>/night</span>
                            {stay.review_count && (
                                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {stay.review_count} reviews
                                </span>
                            )}
                        </div>
                        <button className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
