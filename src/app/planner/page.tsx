'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Activity {
    time: string;
    name: string;
    description: string;
    type: string;
    location: string;
    duration: string;
}

interface DayPlan {
    day: number;
    theme: string;
    activities: Activity[];
    meals: { breakfast: string; lunch: string; dinner: string };
    stay_suggestion: string;
    tips: string;
}

interface Itinerary {
    title: string;
    summary: string;
    days: DayPlan[];
    packing_tips?: string[];
    best_time_to_visit?: string;
    estimated_budget_per_person?: string;
}

const INTERESTS = ['Tripura Sundari Temple', 'Mahi Island Boating', 'Tribal Craft Workshops', 'Mangarh Dham', 'Juna Mahal', 'Chacha Kota Backwaters', 'Heritage Walks', 'Beneshwar Dham', 'Kagdi Pick-Up Weir', 'Forest Trekking', 'Warli Painting', 'Local Cuisine'];
const typeColors: Record<string, string> = { temple: '#7c3aed', nature: '#16a34a', craft: '#d97706', food: '#dc2626', adventure: '#0284c7', heritage: '#b45309' };
const typeIcons: Record<string, string> = { temple: '🛕', nature: '🌿', craft: '🎨', food: '🍽️', adventure: '🚵', heritage: '🏛️' };

function PlannerContent() {
    const searchParams = useSearchParams();
    const [form, setForm] = useState({
        destination: searchParams?.get('destination') ?? 'Banswara',
        trip_type: searchParams?.get('experience') ?? 'cultural',
        duration: 3,
        interests: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [error, setError] = useState('');

    const toggleInterest = (i: string) => {
        setForm(f => ({
            ...f,
            interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
        }));
    };

    const generate = async () => {
        setLoading(true);
        setError('');
        setItinerary(null);
        try {
            const res = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Unknown error');
            setItinerary(data.itinerary);
        } catch (e) {
            setError(`${(e as Error).message}. Make sure GEMINI_API_KEY is set in your .env file.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(224,112,80,0.8)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>✨ AI-Powered</p>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'white', marginBottom: '0.75rem' }}>Smart Itinerary Planner</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>Tell us your preferences — Gemini AI builds your perfect Vagad trip</p>
            </div>

            <div className="container-custom" style={{ padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2.5rem', alignItems: 'start' }}>

                {/* === Form Panel === */}
                <div style={{ position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Plan My Trip 🗺️</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Destination */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📍 Destination</label>
                                <select value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: 'white' }}>
                                    <option value="Banswara">Banswara</option>
                                    <option value="Dungarpur">Dungarpur</option>
                                    <option value="Both Banswara and Dungarpur">Both Districts</option>
                                </select>
                            </div>

                            {/* Trip Type */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🎯 Trip Type</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {['cultural', 'nature', 'spiritual', 'adventure'].map(t => (
                                        <button key={t} onClick={() => setForm(f => ({ ...f, trip_type: t }))} style={{ padding: '0.45rem 0.9rem', borderRadius: '999px', border: form.trip_type === t ? 'none' : '1px solid var(--border)', background: form.trip_type === t ? 'var(--primary)' : 'white', color: form.trip_type === t ? 'white' : 'var(--text-dark)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📅 Duration: <span style={{ color: 'var(--accent)' }}>{form.duration} Days</span></label>
                                <input type="range" min={1} max={7} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}><span>1 day</span><span>7 days</span></div>
                            </div>

                            {/* Interests */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⭐ Must-Include</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {INTERESTS.map(i => (
                                        <button key={i} onClick={() => toggleInterest(i)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: form.interests.includes(i) ? 'none' : '1px solid var(--border)', background: form.interests.includes(i) ? 'var(--accent)' : 'white', color: form.interests.includes(i) ? 'white' : 'var(--text-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={generate}
                                disabled={loading}
                                style={{ justifyContent: 'center', padding: '1rem', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                            >
                                {loading ? '⏳ Generating...' : '✨ Generate My Itinerary'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* === Results Panel === */}
                <div>
                    {!itinerary && !loading && !error && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: '1rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '4rem' }}>🗺️</div>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary)' }}>Ready to explore Vagad?</h3>
                            <p style={{ textAlign: 'center', maxWidth: 340, lineHeight: 1.7 }}>Fill in your travel preferences and let Gemini AI craft a personalised day-by-day itinerary for you.</p>
                            {/* Map */}
                            <div style={{ width: '100%', borderRadius: '1.25rem', overflow: 'hidden', marginTop: '1rem', border: '1px solid var(--border)' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230578.5!2d74.3!3d23.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39681f9d0d4f8ec5%3A0xb3d8c7c1e37123db!2sBanswara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1"
                                    width="100%" height="340" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '1rem', padding: '1.5rem', color: '#dc2626' }}>
                            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>❌ Generation Failed</p>
                            <p style={{ fontSize: '0.9rem' }}>{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '4rem 0' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', border: '5px solid var(--bg)', borderTop: '5px solid var(--primary)', animation: 'spin 0.8s linear infinite' }} />
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>Gemini AI is crafting your itinerary...</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This takes 10–20 seconds</p>
                            </div>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    )}

                    {itinerary && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fadeinup">
                            {/* Header */}
                            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: '1.25rem', padding: '2rem', color: 'white' }}>
                                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.75rem' }}>{itinerary.title}</h2>
                                <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.97rem' }}>{itinerary.summary}</p>
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', opacity: 0.8 }}>
                                    {itinerary.best_time_to_visit && <span>🌤 {itinerary.best_time_to_visit}</span>}
                                    {itinerary.estimated_budget_per_person && <span>💰 {itinerary.estimated_budget_per_person}</span>}
                                </div>
                            </div>

                            {/* Days */}
                            {itinerary.days.map(day => (
                                <div key={day.day} style={{ background: 'white', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                                    <div style={{ background: 'var(--primary)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>Day {day.day}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginLeft: '0.75rem' }}>· {day.theme}</span>
                                        </div>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>🏡 {day.stay_suggestion}</span>
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {/* Activities */}
                                        {day.activities.map((act, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: idx < day.activities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: typeColors[act.type] ?? '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                                                        {typeIcons[act.type] ?? '📌'}
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>{act.time}</span>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{act.name}</h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.3rem' }}>{act.description}</p>
                                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                        <span>📍 {act.location}</span>
                                                        <span>⏱ {act.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Meals */}
                                        <div style={{ background: 'var(--bg)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🍽️ Meals</p>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <span><strong>☀️</strong> {day.meals.breakfast}</span>
                                                <span><strong>🌤</strong> {day.meals.lunch}</span>
                                                <span><strong>🌙</strong> {day.meals.dinner}</span>
                                            </div>
                                        </div>

                                        {/* Tip */}
                                        {day.tips && (
                                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '0.75rem', fontSize: '0.87rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                💡 {day.tips}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Packing tips */}
                            {itinerary.packing_tips && itinerary.packing_tips.length > 0 && (
                                <div style={{ background: '#fef7f0', border: '1px solid rgba(224,112,80,0.2)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem' }}>🎒 Packing Tips</h3>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {itinerary.packing_tips.map((tip, i) => (
                                            <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                                                <span>✓</span>{tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link href="/stays" className="btn-primary">🏡 Book a Homestay</Link>
                                <Link href="/bazaar" className="btn-accent">🛍️ Shop Bhil Bazaar</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .container-custom > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}

export default function PlannerPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid var(--bg)', borderTop: '4px solid var(--primary)', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <PlannerContent />
        </Suspense>
    );
}
