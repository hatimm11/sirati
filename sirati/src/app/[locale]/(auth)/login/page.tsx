'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();
  const isRTL = locale === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dashPath = isRTL ? '/ar/dashboard' : '/en/dashboard';
  const registerPath = isRTL ? '/ar/register' : '/en/register';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(isRTL ? 'بريد إلكتروني أو كلمة مرور خاطئة' : 'Invalid email or password');
    } else {
      toast.success(isRTL ? 'مرحباً بعودتك!' : 'Welcome back!');
      router.push(dashPath);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f5f5f7', padding: '24px',
      fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#fff', borderRadius: 24,
        padding: '48px 40px',
        boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
      }}>
        {/* Logo */}
        <Link href={isRTL ? '/ar' : '/en'} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 15,
            background: 'linear-gradient(135deg, #0071e3, #2997ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: '#fff',
          }}>س</div>
        </Link>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', marginBottom: 8, textAlign: 'center' }}>
          {t('login_title')}
        </h1>
        <p style={{ fontSize: 15, color: '#6e6e73', textAlign: 'center', marginBottom: 36 }}>
          {t('login_subtitle')}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.1)',
            background: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 500, color: '#1d1d1f',
            marginBottom: 24, transition: 'background 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f7')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.7 19 12 24 12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.3C29.3 35.2 26.8 36 24 36c-5.2 0-9.7-3.2-11.4-7.8l-6.6 5.1C9.5 39.4 16.3 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C40.9 36.5 44 30.7 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          {t('google_btn')}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          <span style={{ fontSize: 13, color: '#86868b' }}>{t('or')}</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#1d1d1f', display: 'block', marginBottom: 8 }}>
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1.5px solid rgba(0,0,0,0.1)',
                background: '#f5f5f7', fontSize: 15, outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
                fontFamily: 'inherit', direction: 'ltr', textAlign: 'left',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0071e3'; e.currentTarget.style.background = '#fff'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = '#f5f5f7'; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#1d1d1f' }}>
                {t('password')}
              </label>
              <Link href={isRTL ? '/ar/forgot-password' : '/en/forgot-password'}
                style={{ fontSize: 13, color: '#0071e3', textDecoration: 'none' }}>
                {t('forgot_password')}
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1.5px solid rgba(0,0,0,0.1)',
                background: '#f5f5f7', fontSize: 15, outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
                fontFamily: 'inherit', direction: 'ltr', textAlign: 'left',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0071e3'; e.currentTarget.style.background = '#fff'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = '#f5f5f7'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: loading ? '#86868b' : '#0071e3',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 16, fontWeight: 600, transition: 'background 0.2s',
              fontFamily: 'inherit', marginTop: 4,
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = '#0077ed'); }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = '#0071e3'); }}
          >
            {loading ? (isRTL ? 'جارٍ الدخول...' : 'Signing in...') : t('login_btn')}
          </button>
        </form>

        <p style={{ fontSize: 14, color: '#6e6e73', textAlign: 'center', marginTop: 28 }}>
          {t('no_account')}{' '}
          <Link href={registerPath} style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
            {isRTL ? 'أنشئ حساباً' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  );
}
