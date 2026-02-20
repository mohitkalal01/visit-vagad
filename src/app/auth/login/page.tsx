'use client';

import { useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await account.createEmailPasswordSession(form.email, form.password);
            router.push('/');
        } catch (err) {
            setError((err as { message: string }).message ?? 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '100%', maxWidth: 440 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e07050, #c05a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>V</div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>Visit<span style={{ color: 'var(--accent)' }}>Vagad</span></span>
                        </div>
                    </Link>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-dark)', marginTop: '1.25rem', marginBottom: '0.4rem' }}>Welcome back</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to your VisitVagad account</p>
                </div>

                <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', key: 'email' },
                            { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', key: 'password' },
                        ].map(field => (
                            <div key={field.id}>
                                <label htmlFor={field.id} style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</label>
                                <input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required
                                    value={form[field.key as keyof typeof form]}
                                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                                />
                            </div>
                        ))}

                        {error && <p style={{ color: '#dc2626', fontSize: '0.88rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '0.6rem 0.9rem' }}>{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>or continue as</span>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        </div>

                        <Link href="/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                            🌐 Guest / Continue without login
                        </Link>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
                </p>
            </div>
        </div>
    );
}
