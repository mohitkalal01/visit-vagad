'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { DB_ID, STAYS_COL } from '@/lib/collections';
import { useParams } from 'next/navigation';
import Badge from '@/components/Badge';
import Link from 'next/link';
import { Stay } from '@/components/StayCard';

const mockStays: Record<string, Stay & { description?: string; amenities?: string[] }> = {
  s1: { $id: 's1', name: 'Mahi River Farm Cottage', location: 'Banswara', district: 'Banswara', host_name: 'Ramdev Patel', paryatan_mitra_level: 2, rips_certified: true, price_per_night: 2500, rating: 4.8, review_count: 42, type: 'farm_stay', distance_from_landmark: '3 km from Mahi Dam', images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=800&h=500&fit=crop'], description: 'Wake up to river views at our organic farm cottage. Experience authentic Vagad village life, help with farm activities if you wish, and enjoy home-cooked Rajasthani tribal meals.', amenities: ['Home-cooked meals', 'River-view veranda', 'Organic farm tour', 'Bonfire evenings', 'Bird-watching point', 'Local guide'] },
  s2: { $id: 's2', name: 'Juna Mahal Heritage Home', location: 'Dungarpur', district: 'Dungarpur', host_name: 'Saroj Mehta', paryatan_mitra_level: 3, rips_certified: true, price_per_night: 3800, rating: 4.9, review_count: 67, type: 'heritage_home', distance_from_landmark: '500m from Juna Mahal', images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop'], description: 'A lovingly restored 150-year-old haveli adjacent to Juna Mahal palace. Each room features original stone carvings, hand-painted murals, and period furniture.', amenities: ['Heritage architecture', 'Rooftop terrace', 'Traditional cuisine', 'Palace walking tour', 'AC rooms', 'Marble courtyard'] },
  s3: { $id: 's3', name: 'Tribal Eco Hut — Anandpuri', location: 'Anandpuri, Banswara', district: 'Banswara', host_name: 'Bhanwarlal Bhil', paryatan_mitra_level: 1, rips_certified: false, price_per_night: 1400, rating: 4.5, review_count: 28, type: 'eco_hut', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop'], description: 'An authentic Bhil tribal eco-hut built from local bamboo and mud plaster. Experience tribal life at its most genuine. Our host plays traditional instruments every evening.', amenities: ['Bamboo eco-construction', 'Tribal music evenings', 'Warli art class', 'Forest walks', 'Solar lighting', 'Composting toilets'] },
};

type StayWithExtras = Stay & { description?: string; amenities?: string[] };

export default function StayDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [stay, setStay] = useState<StayWithExtras | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 2 });

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const doc = await databases.getDocument(DB_ID, STAYS_COL, id);
        setStay(doc as unknown as StayWithExtras);
      } catch {
        setStay(mockStays[id] ?? mockStays['s1']);
      } finally {
        setLoading(false);
      }
    };
    fetchStay();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid var(--bg)', borderTop: '4px solid var(--primary)', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!stay) return <div style={{ padding: '5rem', textAlign: 'center' }}>Stay not found.</div>;

  const images = stay.images?.length ? stay.images : [`https://picsum.photos/seed/stay-${id}/800/500`];
  const nights = form.checkIn && form.checkOut ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000)) : 1;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 1.5rem' }}>
        <div className="container-custom" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <span>›</span><Link href="/stays" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Vagad Stays</Link>
          <span>›</span><span>{stay.name}</span>
        </div>
      </div>

      <div className="container-custom" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <div style={{ borderRadius: '1.25rem', overflow: 'hidden', height: 420, marginBottom: '1rem' }}>
              <img src={images[activeImg]} alt={stay.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 60, borderRadius: '0.75rem', overflow: 'hidden', border: i === activeImg ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', padding: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>{stay.name}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {stay.rips_certified && <Badge variant="rips">RIPS 2024 Certified</Badge>}
              {stay.paryatan_mitra_level && <Badge variant="paryatan">Paryatan Mitra L{stay.paryatan_mitra_level}</Badge>}
              {stay.district && <Badge variant="district">{stay.district}</Badge>}
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.97rem' }}>{stay.description}</p>

            {stay.amenities && (
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>What&apos;s Included</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {stay.amenities.map(a => (
                    <div key={a} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.65rem 1rem', fontSize: '0.88rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--primary)' }}>✓</span> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border)', marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0 }}>
                {stay.host_name?.[0]}
              </div>
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>Hosted by {stay.host_name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stay.location} · {stay.distance_from_landmark}</p>
                {stay.rating && <p style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '0.25rem' }}>⭐ {stay.rating} · {stay.review_count} reviews</p>}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div style={{ position: 'sticky', top: '5rem' }}>
            <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.75rem', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--primary)' }}>₹{stay.price_per_night.toLocaleString('en-IN')}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/night</span>
              </div>

              {booked ? (
                <div style={{ background: '#dcfce7', border: '1px solid #4ade80', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#15803d', fontSize: '1.1rem' }}>Booking Confirmed!</p>
                  <p style={{ color: '#166534', fontSize: '0.9rem', marginTop: '0.4rem' }}>Host {stay.host_name} will contact you within 24 hours.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Check In</label>
                      <input type="date" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Check Out</label>
                      <input type="date" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guests</label>
                    <input type="number" min={1} max={10} value={form.guests} onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))} style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: '1rem', padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>₹{stay.price_per_night.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>₹{(stay.price_per_night * nights).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--primary)' }}>
                      <span>Total</span><span>₹{(stay.price_per_night * nights).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setBooked(true)} style={{ justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>Reserve Stay</button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>You won&apos;t be charged yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
