'use client';

import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ProductCard, { Product } from '@/components/ProductCard';
import StayCard, { Stay } from '@/components/StayCard';

// Mock data used when Appwrite collections are empty / not configured
const mockProducts: Product[] = [
  { $id: 'p1', name: 'Bamboo Wind Chimes', category: 'bamboo_crafts', price: 850, artisan_name: 'Ramesh Bhil', artisan_verified: true, district: 'Banswara', images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'] },
  { $id: 'p2', name: 'Warli Village Painting', category: 'warli', price: 2400, artisan_name: 'Sunita Gamit', artisan_verified: true, district: 'Dungarpur', images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'] },
  { $id: 'p3', name: 'Terracotta Tribal Vase', category: 'terracotta', price: 1200, artisan_name: 'Mohanlal Vasave', artisan_verified: false, district: 'Banswara', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop'] },
  { $id: 'p4', name: 'Sandstone Deity Carving', category: 'stone_carvings', price: 5500, artisan_name: 'Devji Katara', artisan_verified: true, district: 'Dungarpur', images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'] },
];

const mockStays: Stay[] = [
  { $id: 's1', name: 'Mahi River Farm Cottage', location: 'Banswara', district: 'Banswara', host_name: 'Ramdev Patel', paryatan_mitra_level: 2, rips_certified: true, price_per_night: 2500, rating: 4.8, review_count: 42, type: 'farm_stay', distance_from_landmark: '3 km from Mahi Dam', images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=300&fit=crop'] },
  { $id: 's2', name: 'Juna Mahal Heritage Home', location: 'Dungarpur', district: 'Dungarpur', host_name: 'Saroj Mehta', paryatan_mitra_level: 3, rips_certified: true, price_per_night: 3800, rating: 4.9, review_count: 67, type: 'heritage_home', distance_from_landmark: '500m from Juna Mahal', images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'] },
  { $id: 's3', name: 'Tribal Eco Hut — Anandpuri', location: 'Anandpuri, Banswara', district: 'Banswara', host_name: 'Bhanwarlal Bhil', paryatan_mitra_level: 1, rips_certified: false, price_per_night: 1400, rating: 4.5, review_count: 28, type: 'eco_hut', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'] },
];

const experiences = [
  { icon: '🚣', title: 'Mahi Island Boating', desc: 'Glide through the serene backwaters of Mahi River on a traditional boat', href: '/destinations#boating' },
  { icon: '🏛️', title: 'Tripura Sundari Temple', desc: 'Visit the 1008 CE temple of Goddess Tripura Sundari in Banswara', href: '/destinations#temple' },
  { icon: '🎨', title: 'Warli Craft Workshop', desc: 'Learn tribal Warli painting directly from Govt. Verified Artisans', href: '/destinations#workshop' },
  { icon: '🚵', title: 'Chacha Kota Trail', desc: 'Trek through the lush hills overlooking Chacha Kota Backwaters', href: '/destinations#trek' },
];

export default function Home() {
  return (
    <div>
      {/* ======================== HERO ======================== */}
      <section style={{
        minHeight: '92vh',
        background: 'linear-gradient(135deg, rgba(18,42,32,0.88) 0%, rgba(26,58,46,0.75) 50%, rgba(96,60,20,0.6) 100%), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80) center/cover no-repeat',
        display: 'flex', alignItems: 'center',
        padding: '4rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Floating decorative dots */}
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(224,112,80,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(224,112,80,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '3%', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

        <div className="container-custom" style={{ zIndex: 1 }}>
          {/* Pre-title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(224,112,80,0.15)', border: '1px solid rgba(224,112,80,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#f0a080', fontFamily: 'Outfit, sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              🌿 Discover Rajasthan's Hidden Gem
            </span>
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'white', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: 680 }}>
            Experience the Soul of <span style={{ background: 'linear-gradient(135deg, #e07050, #f0a080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vagad</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.8)', maxWidth: 560, lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Tribal culture, ancient temples, Mahi River backwaters, and handcrafted Bhil art — all in Banswara & Dungarpur, Rajasthan.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[['50+', 'Rural Homestays'], ['200+', 'Verified Artisans'], ['15+', 'Destinations'], ['4.8★', 'Avg. Rating']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#e07050' }}>{num}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
            <Link href="/planner" className="btn-accent">✨ Plan with AI</Link>
            <Link href="/destinations" className="btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>Explore Destinations →</Link>
          </div>
        </div>
      </section>

      {/* ======================== TRUST STRIP ======================== */}
      <div style={{ background: 'var(--primary)', padding: '1rem 1.5rem', overflowX: 'auto' }}>
        <div className="container-custom" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            ['✅', 'RIPS 2024 Certified Platform'],
            ['🏛️', 'Govt. Verified Artisans'],
            ['⭐', 'Paryatan Mitra Hosts'],
            ['🌿', 'Eco-Responsible Tourism'],
            ['🔒', 'Secure Appwrite-Backed Bookings'],
          ].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', fontWeight: 500, whiteSpace: 'nowrap' }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>

      {/* ======================== BHIL BAZAAR SECTION ======================== */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg)' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                🛍️ Bhil Bazaar
              </p>
              <h2 className="section-title" style={{ margin: 0 }}>Handcrafted Tribal Art</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Authentic crafts by Govt. Verified Artisans of Vagad</p>
            </div>
            <Link href="/bazaar" className="btn-outline">Browse All Products →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {mockProducts.map(p => <ProductCard key={p.$id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ======================== VAGAD STAYS SECTION ======================== */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                🏡 Vagad Stays
              </p>
              <h2 className="section-title" style={{ margin: 0 }}>Rural Homestays</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Stay with certified Paryatan Mitra hosts across Vagad</p>
            </div>
            <Link href="/stays" className="btn-outline">View All Stays →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {mockStays.map(s => <StayCard key={s.$id} stay={s} />)}
          </div>
        </div>
      </section>

      {/* ======================== EXPERIENCES SECTION ======================== */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              🎯 Unique Experiences
            </p>
            <h2 className="section-title" style={{ textAlign: 'center' }}>What Makes Vagad Special</h2>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>Curated cultural and adventure experiences</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {experiences.map(exp => (
              <Link key={exp.title} href={exp.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{exp.icon}</div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.6rem' }}>{exp.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{exp.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== AI PLANNER CTA ======================== */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, #3a6a50 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />
        <div className="container-custom" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', marginBottom: '1rem' }}>
            Let AI Plan Your Perfect Vagad Trip
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 2rem' }}>
            Answer a few questions — Gemini AI builds your personalised day-wise Vagad itinerary instantly, covering all the must-see landmarks.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/planner" className="btn-accent" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}>✨ Generate My Itinerary</Link>
            <Link href="/destinations" style={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.25)', padding: '0.9rem 2rem', borderRadius: '999px', fontFamily: 'Outfit, sans-serif', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', fontSize: '1.05rem' }}>Browse Destinations</Link>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Traveller Stories</h2>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>What visitors say about Vagad</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Priya Sharma', city: 'Ahmedabad', rating: 5, text: 'The Warli painting workshop was life-changing! Our host Ramdev was incredible. Vagad is truly a hidden gem.' },
              { name: 'Ankit Mehta', city: 'Jaipur', rating: 5, text: 'Mahi Island boating at sunrise — absolutely magical. The homestay food was authentic Rajasthani tribal cuisine. Loved every bit!' },
              { name: 'Sneha Gupta', city: 'Mumbai', rating: 5, text: 'The AI planner gave us the perfect 3-day itinerary. Tripura Sundari temple visit at dawn was spiritual and stunning.' },
            ].map(t => (
              <div key={t.name} style={{ background: 'var(--bg)', borderRadius: '1rem', padding: '1.75rem', border: '1px solid var(--border)' }}>
                <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{'⭐'.repeat(t.rating)}</div>
                <p style={{ color: 'var(--text-dark)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
