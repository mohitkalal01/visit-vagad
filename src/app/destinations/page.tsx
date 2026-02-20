'use client';

import Link from 'next/link';

const destinations = [
    {
        id: 'temple',
        icon: '🛕',
        title: 'Tripura Sundari Temple',
        district: 'Banswara',
        type: 'Spiritual',
        description: 'One of 108 Shakti Peethas, this 1008 CE temple atop a hillock offers breathtaking views of Banswara city. Best visited at sunrise — the temple bells and misty landscape create an ethereal experience.',
        highlights: ['108 Shakti Peetha', 'Panoramic hilltop views', 'Ancient 1008 CE architecture', 'Sunrise photography'],
        timing: 'Open 5 AM – 8 PM | Best at Sunrise',
        image: 'https://images.unsplash.com/photo-1609766857003-00e9f2a2dc65?w=800&h=500&fit=crop',
    },
    {
        id: 'boating',
        icon: '🚣',
        title: 'Mahi Island Boating',
        district: 'Banswara',
        type: 'Nature',
        description: 'The Mahi Dam backwaters scatter 50+ islands across the reservoir. Boat rides weave through green jungle islands — it\'s earned Banswara the title "City of One Hundred Islands".',
        highlights: ['50+ jungle islands', 'Traditional boat rides', 'Sunset views', 'Local fishing experience'],
        timing: 'Boats available 7 AM – 6 PM | Best at Sunset',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
    },
    {
        id: 'mangarh',
        icon: '⚔️',
        title: 'Mangarh Dham',
        district: 'Banswara',
        type: 'Heritage',
        description: 'A hilltop memorial to 1500 Bhil tribal freedom fighters massacred in 1913. This sacred site now stands as a symbol of tribal resistance against British colonial rule, surrounded by lush forests.',
        highlights: ['Historic tribal memorial', 'Forest trekking path', 'Panoramic Mahi valley views', 'Bhil heritage museum'],
        timing: 'Open daily | Best in morning',
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=500&fit=crop',
    },
    {
        id: 'junamahal',
        icon: '🏛️',
        title: 'Juna Mahal',
        district: 'Dungarpur',
        type: 'Heritage',
        description: 'A 13th-century multi-storied palace fortress covered in intricate stone carvings, mirror-work frescoes, and elaborate wall paintings. One of Rajasthan\'s finest medieval architectural gems.',
        highlights: ['700-year-old palace', 'Mirror-work frescoes', 'Stone & glass artwork', 'Royal family history tours'],
        timing: 'Open 9 AM – 5 PM | Closed Fridays',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=500&fit=crop',
    },
    {
        id: 'chachakota',
        icon: '🌊',
        title: 'Chacha Kota Backwaters',
        district: 'Dungarpur',
        type: 'Nature',
        description: 'Hidden in the Aravalli hills, this serene backwater zone offers stunning landscapes with emerald-green water, forested hills, and complete solitude — perfect for kayaking and meditative walks.',
        highlights: ['Kayaking & boating', 'Aravalli hill trekking', 'Birding hotspot', 'Sunset photographer\'s paradise'],
        timing: 'Best October – March',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop',
    },
    {
        id: 'workshop',
        icon: '🎨',
        title: 'Tribal Craft Workshops',
        district: 'Both',
        type: 'Culture',
        description: 'Learn directly from Govt. Verified Master Artisans — Warli painting on traditional khadi paper, bamboo basket weaving, terracotta pottery on a kick wheel, and tribal textile dyeing.',
        highlights: ['Warli painting class', 'Bamboo craft session', 'Terracotta pottery', 'Take your creation home'],
        timing: 'Sessions 9 AM & 3 PM | Book 24h ahead',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop',
    },
    {
        id: 'kagdi',
        icon: '🌉',
        title: 'Kagdi Pick-Up Weir',
        district: 'Banswara',
        type: 'Nature',
        description: 'A beautiful stepped stone weir on the Kagdi River within Banswara city. Local families gather here at dusk for picnics, and the cascading water over sandstone steps creates a mesmerizing sight.',
        highlights: ['Picnic by the weir', 'Sunset photography', 'Local street food stalls', 'Walking distance from city'],
        timing: 'Open 24 hours | Best at Dusk',
        image: 'https://images.unsplash.com/photo-1574508258028-dc47f0e25ddb?w=800&h=500&fit=crop',
    },
    {
        id: 'beneshwar',
        icon: '🙏',
        title: 'Beneshwar Dham',
        district: 'Both',
        type: 'Spiritual',
        description: 'The "Kashi of Tribals" — a sacred Triveni ghats where three rivers (Mahi, Som, Jakham) meet. Hosts a massive annual tribal fair (Magh Purnima) drawing 500,000+ pilgrims each year.',
        highlights: ['Sacred Triveni confluence', 'Annual tribal Mela', 'Ancient Shiva temple', 'Tribal cultural performances'],
        timing: 'Fair: Feb. | Temple: Daily 5 AM – 8 PM',
        image: 'https://images.unsplash.com/photo-1599030959804-f58a0e8f52a0?w=800&h=500&fit=crop',
    },
];

const typeColors: Record<string, string> = {
    Spiritual: '#7c3aed',
    Nature: '#16a34a',
    Heritage: '#b45309',
    Culture: '#d97706',
};

export default function DestinationsPage() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #122a20, var(--primary))', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(224,112,80,0.8)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>🗺️ Destinations & Experiences</p>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'white', marginBottom: '0.75rem' }}>Discover Vagad</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 2rem' }}>Temples, backwaters, tribal crafts, and heritage palaces across Banswara & Dungarpur</p>
                <Link href="/planner" className="btn-accent" style={{ display: 'inline-flex' }}>✨ Plan Your Visit with AI</Link>
            </div>

            <div className="container-custom" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
                    {destinations.map(dest => (
                        <div key={dest.id} id={dest.id} className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                                <img src={dest.image} alt={dest.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ background: 'rgba(0,0,0,0.55)', color: 'white', borderRadius: '999px', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                                        {dest.icon} {dest.type}
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                    <span style={{ background: typeColors[dest.type] ?? '#6b7280', color: 'white', borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                                        📍 {dest.district}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{dest.title}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{dest.description}</p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {dest.highlights.map(h => (
                                            <span key={h} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-dark)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>
                                                ✓ {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>⏰ {dest.timing}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map Section */}
                <div style={{ marginTop: '4rem' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Vagad Region Map</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>All destinations are within Banswara & Dungarpur districts of Southern Rajasthan</p>
                    <div style={{ borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d922234!2d74.0!3d23.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39681f9d0d4f8ec5%3A0xb3d8c7c1e37123db!2sVagad%20Region!5e0!3m2!1sen!2sin!4v1"
                            width="100%" height="420" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
