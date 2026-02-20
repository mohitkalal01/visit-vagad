'use client';

import { useState } from 'react';
import Link from 'next/link';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

export default function SignUpPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await account.create(ID.unique(), form.email, form.password, form.name);
            await account.createEmailPasswordSession(form.email, form.password);
            setSuccess(true);
        } catch (err) {
            setError((err as { message: string }).message ?? 'Sign up failed. Please try again.');
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
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-dark)', marginTop: '1.25rem', marginBottom: '0.4rem' }}>Create your account</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join thousands of Vagad travellers</p>
                </div>

                <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
                    {success ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Welcome to VisitVagad!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your account has been created successfully.</p>
                            <Link href="/" className="btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>Explore Vagad →</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Priya Sharma', key: 'name' },
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
