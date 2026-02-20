'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { DB_ID, STAYS_COL } from '@/lib/collections';
import { Query } from 'appwrite';
import StayCard, { Stay } from '@/components/StayCard';

const TYPES = [
  { key: 'all', label: 'All Types', emoji: '🏠' },
  { key: 'farm_stay', label: 'Farm Stay', emoji: '🌾' },
  { key: 'heritage_home', label: 'Heritage Home', emoji: '🏛️' },
  { key: 'eco_hut', label: 'Eco Hut', emoji: '🌿' },
];

const mockStays: Stay[] = [
  { $id: 's1', name: 'Mahi River Farm Cottage', location: 'Banswara', district: 'Banswara', host_name: 'Ramdev Patel', paryatan_mitra_level: 2, rips_certified: true, price_per_night: 2500, rating: 4.8, review_count: 42, type: 'farm_stay', distance_from_landmark: '3 km from Mahi Dam', images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=400&fit=crop'] },
  { $id: 's2', name: 'Juna Mahal Heritage Home', location: 'Dungarpur', district: 'Dungarpur', host_name: 'Saroj Mehta', paryatan_mitra_level: 3, rips_certified: true, price_per_night: 3800, rating: 4.9, review_count: 67, type: 'heritage_home', distance_from_landmark: '500m from Juna Mahal', images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'] },
  { $id: 's3', name: 'Tribal Eco Hut — Anandpuri', location: 'Anandpuri, Banswara', district: 'Banswara', host_name: 'Bhanwarlal Bhil', paryatan_mitra_level: 1, rips_certified: false, price_per_night: 1400, rating: 4.5, review_count: 28, type: 'eco_hut', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop'] },
  { $id: 's4', name: 'Tripura Sundari View Cottage', location: 'Matagi, Banswara', district: 'Banswara', host_name: 'Gita Devi', paryatan_mitra_level: 2, rips_certified: true, price_per_night: 2200, rating: 4.7, review_count: 35, type: 'farm_stay', distance_from_landmark: '1 km from Tripura Sundari Temple', images: ['https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&h=400&fit=crop'] },
  { $id: 's5', name: 'Kagdi Weir Riverside Home', location: 'Banswara City', district: 'Banswara', host_name: 'Lalit Trivedi', paryatan_mitra_level: 3, rips_certified: true, price_per_night: 3200, rating: 4.9, review_count: 89, type: 'heritage_home', distance_from_landmark: 'Adjacent to Kagdi Pick-Up Weir', images: ['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&h=400&fit=crop'] },
  { $id: 's6', name: 'Chacha Kota Hilltop Hut', location: 'Chacha Kota, Dungarpur', district: 'Dungarpur', host_name: 'Bhuri Bariya', paryatan_mitra_level: 1, rips_certified: false, price_per_night: 1100, rating: 4.3, review_count: 18, type: 'eco_hut', distance_from_landmark: 'Overlooking Chacha Kota Backwaters', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop'] },
];

export default function StaysPage() {
  const [stays, setStays] = useState<Stay[]>(mockStays);
  const [activeType, setActiveType] = useState('all');
  const [district, setDistrict] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [ripsOnly, setRipsOnly] = useState(false);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const queries: string[] = [Query.limit(50)];
        if (activeType !== 'all') queries.push(Query.equal('type', activeType));
        if (district !== 'all') queries.push(Query.equal('district', district));
        const res = await databases.listDocuments(DB_ID, STAYS_COL, queries);
        if (res.documents.length > 0) setStays(res.documents as unknown as Stay[]);
      } catch {
        // Silently use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, [activeType, district]);

  const filtered = stays.filter(s => {
    const typeOk = activeType === 'all' || s.type === activeType;
    const distOk = district === 'all' || s.district?.toLowerCase() === district;
    const priceOk = s.price_per_night <= maxPrice;
    const ripsOk = !ripsOnly || s.rips_certified;
    return typeOk && distOk && priceOk && ripsOk;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #122a20, var(--primary))', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(224,112,80,0.8)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>🏡 Vagad Stays</p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'white', marginBottom: '0.75rem' }}>Rural Homestays</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>Stay with certified Paryatan Mitra hosts across the Vagad region</p>
      </div>

      <div className="container-custom" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Type tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button key={t.key} onClick={() => setActiveType(t.key)} style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: activeType === t.key ? 'none' : '1px solid var(--border)', background: activeType === t.key ? 'var(--primary)' : 'white', color: activeType === t.key ? 'white' : 'var(--text-dark)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginLeft: 'auto' }}>
            {/* District */}
            <select value={district} onChange={e => setDistrict(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', background: 'white', cursor: 'pointer', outline: 'none' }}>
              <option value="all">📍 All Districts</option>
              <option value="banswara">Banswara</option>
              <option value="dungarpur">Dungarpur</option>
            </select>

            {/* Max price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>₹ Max</span>
              <input type="range" min={1000} max={10000} step={500} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: 80, accentColor: 'var(--primary)' }} />
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>

            {/* RIPS filter */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
              <input type="checkbox" checked={ripsOnly} onChange={e => setRipsOnly(e.target.checked)} style={{ accentColor: '#15803d' }} />
              ✅ RIPS Certified Only
            </label>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Showing <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> homestays
        </p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 360, borderRadius: '1rem' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(s => <StayCard key={s.$id} stay={s} />)}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏡</div>
            <p style={{ fontSize: '1.1rem' }}>No stays match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
