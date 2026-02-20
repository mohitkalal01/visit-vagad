import Link from 'next/link';

const quickLinks = [
    { href: '/destinations', label: 'Destinations' },
    { href: '/bazaar', label: 'Bhil Bazaar' },
    { href: '/stays', label: 'Vagad Stays' },
    { href: '/planner', label: 'AI Planner' },
];

const landmarks = [
    'Tripura Sundari Temple',
    'Mangarh Dham',
    'Mahi Dam',
    'Chacha Kota Backwaters',
    'Juna Mahal',
];

export default function Footer() {
    return (
        <footer style={{ background: 'var(--primary-dark)', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}>
            <div className="container-custom" style={{ padding: '3rem 1.5rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>

                    {/* Brand */}
                    <div>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #e07050, #c05a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'white', fontSize: '1rem' }}>V</div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
                                Visit<span style={{ color: '#e07050' }}>Vagad</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', maxWidth: 240 }}>
                            Discover the untouched beauty of Vagad — tribal culture, rural homestays, and authentic Bhil crafts.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                            {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', textDecoration: 'none', transition: 'background 0.2s' }}>
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {quickLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                                        → {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Landmarks */}
                    <div>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Must-Visit</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {landmarks.map(l => (
                                <li key={l} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>📍 {l}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>
                            <div>📍 Banswara, Rajasthan 327001</div>
                            <div>📞 +91 98765 43210</div>
                            <div>✉️ hello@visitvagad.in</div>
                            <div style={{ marginTop: '0.5rem' }}>
                                <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    🟢 RIPS 2024 Certified Platform
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
                    <span>© 2025 VisitVagad. All rights reserved. Powered by Rajasthan Tourism.</span>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
