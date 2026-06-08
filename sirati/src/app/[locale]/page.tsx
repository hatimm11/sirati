'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ── Icons ────────────────────────────────────────
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" fill="#0071e3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10 L8 14 L16 6" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Navbar ───────────────────────────────────────
function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link href={`/${locale === 'ar' ? '' : locale}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, #0071e3, #2997ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff',
              }}>س</div>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.3px' }}>
                {locale === 'ar' ? 'سيرتي' : 'Sirati'}
              </span>
            </div>
          </Link>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href={locale === 'ar' ? '/login' : '/en/login'}
              style={{
                padding: '8px 18px', borderRadius: 10, fontSize: 15,
                color: '#1d1d1f', textDecoration: 'none', fontWeight: 500,
                transition: 'background 0.2s',
              }}
            >
              {t('login')}
            </Link>
            <Link
              href={locale === 'ar' ? '/register' : '/en/register'}
              style={{
                padding: '8px 18px', borderRadius: 10, fontSize: 15,
                background: '#0071e3', color: '#fff', textDecoration: 'none',
                fontWeight: 500, transition: 'background 0.2s',
              }}
            >
              {t('register')}
            </Link>
            {/* Lang toggle */}
            <Link
              href={locale === 'ar' ? '/en' : '/'}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13,
                background: 'rgba(0,0,0,0.05)', color: '#6e6e73',
                textDecoration: 'none', fontWeight: 500,
              }}
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Feature Card ─────────────────────────────────
function FeatureCard({ icon, title, desc, delay }: {
  icon: string; title: string; desc: string; delay: number;
}) {
  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${delay}ms`, opacity: 0,
        background: '#fff', borderRadius: 18,
        padding: '28px 28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'rgba(0,113,227,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 16,
      }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ── Stat ─────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-1px' }}>{value}</div>
      <div style={{ fontSize: 15, color: '#6e6e73', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────
export default function HomePage() {
  const t = useTranslations('hero');
  const tf = useTranslations('features');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif' }}>
      <Navbar locale={locale} />

      {/* ── Hero ─────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,113,227,0.08), transparent)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 100,
              background: 'rgba(0,113,227,0.08)',
              border: '1px solid rgba(0,113,227,0.15)',
              marginBottom: 32, cursor: 'default',
            }}
          >
            <SparkleIcon />
            <span style={{ fontSize: 14, color: '#0071e3', fontWeight: 500 }}>{t('badge')}</span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up animate-delay-100"
            style={{
              fontSize: 'clamp(52px, 8vw, 80px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              color: '#1d1d1f',
              marginBottom: 0,
            }}
          >
            {t('title')}
          </h1>
          <h1
            className="animate-fade-up animate-delay-100"
            style={{
              fontSize: 'clamp(52px, 8vw, 80px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #0071e3, #2997ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 28,
            }}
          >
            {t('title_highlight')}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up animate-delay-200"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              color: '#6e6e73',
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 auto 48px',
              fontWeight: 400,
            }}
          >
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up animate-delay-300"
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              href={isRTL ? '/register' : '/en/register'}
              style={{
                padding: '16px 36px', borderRadius: 14, fontSize: 17, fontWeight: 600,
                background: '#0071e3', color: '#fff', textDecoration: 'none',
                transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(0,113,227,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#0077ed';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#0071e3';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
              }}
            >
              {t('cta_primary')}
              <span style={{ fontSize: 20 }}>←</span>
            </Link>
            <Link
              href="#features"
              style={{
                padding: '16px 36px', borderRadius: 14, fontSize: 17, fontWeight: 600,
                background: 'rgba(0,0,0,0.05)', color: '#1d1d1f', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.05)';
              }}
            >
              {t('cta_secondary')}
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up animate-delay-400"
            style={{
              display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap',
              marginTop: 72, paddingTop: 48,
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Stat value="+10K" label={t('stats_cvs')} />
            <Stat value="+2K" label={t('stats_users')} />
            <Stat value="< 10" label={t('stats_time')} />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px', background: '#f5f5f7' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-1px', color: '#1d1d1f' }}>
              {tf('title')}
            </h2>
            <p style={{ fontSize: 20, color: '#6e6e73', marginTop: 12 }}>
              {tf('subtitle')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            <FeatureCard icon="🤖" title={tf('ai_title')} desc={tf('ai_desc')} delay={0} />
            <FeatureCard icon="🌐" title={tf('bilingual_title')} desc={tf('bilingual_desc')} delay={100} />
            <FeatureCard icon="📄" title={tf('pdf_title')} desc={tf('pdf_desc')} delay={200} />
            <FeatureCard icon="🎯" title={tf('ats_title')} desc={tf('ats_desc')} delay={300} />
            <FeatureCard icon="✉️" title={tf('cover_title')} desc={tf('cover_desc')} delay={400} />
            <FeatureCard icon="📊" title={tf('match_title')} desc={tf('match_desc')} delay={500} />
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────── */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(135deg, #0071e3 0%, #2997ff 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700,
            color: '#fff', letterSpacing: '-1px', marginBottom: 20,
          }}>
            {isRTL ? 'ابدأ الآن مجاناً' : 'Start for free today'}
          </h2>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', marginBottom: 40 }}>
            {isRTL
              ? 'لا تحتاج بطاقة ائتمان. أنشئ سيرتك الأولى في ثوانٍ.'
              : 'No credit card needed. Create your first CV in seconds.'}
          </p>
          <Link
            href={isRTL ? '/register' : '/en/register'}
            style={{
              display: 'inline-block', padding: '18px 48px', borderRadius: 14,
              background: '#fff', color: '#0071e3', fontSize: 18, fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
            }}
          >
            {isRTL ? 'ابدأ مجاناً ←' : '→ Start Free'}
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer style={{
        padding: '60px 24px 40px',
        background: '#1d1d1f',
        color: '#fff',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40, marginBottom: 48,
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'linear-gradient(135deg, #0071e3, #2997ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: '#fff',
                }}>س</div>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                  {isRTL ? 'سيرتي' : 'Sirati'}
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#86868b', lineHeight: 1.7 }}>
                {isRTL ? 'سيرتك، بكلمة.' : 'Your story. Crafted by AI.'}
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 16 }}>
                {isRTL ? 'المنتج' : 'Product'}
              </h4>
              {[
                { href: '#features', label: isRTL ? 'المميزات' : 'Features' },
                { href: isRTL ? '/pricing' : '/en/pricing', label: isRTL ? 'الأسعار' : 'Pricing' },
                { href: isRTL ? '/register' : '/en/register', label: isRTL ? 'ابدأ مجاناً' : 'Start Free' },
              ].map((link) => (
                <div key={link.label} style={{ marginBottom: 10 }}>
                  <Link href={link.href} style={{ fontSize: 14, color: '#86868b', textDecoration: 'none', transition: 'color 0.2s' }}>
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Legal Links */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 16 }}>
                {isRTL ? 'قانوني' : 'Legal'}
              </h4>
              {[
                { href: isRTL ? '/privacy' : '/en/privacy', label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy' },
                { href: isRTL ? '/terms' : '/en/terms', label: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions' },
                { href: isRTL ? '/refund' : '/en/refund', label: isRTL ? 'سياسة الاسترجاع' : 'Refund Policy' },
              ].map((link) => (
                <div key={link.label} style={{ marginBottom: 10 }}>
                  <Link href={link.href} style={{ fontSize: 14, color: '#86868b', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* License Info */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 16 }}>
                {isRTL ? 'بيانات الترخيص' : 'License Info'}
              </h4>
              <div style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.8 }}>
                <div>{isRTL ? 'وثيقة العمل الحر:' : 'Freelance License:'} <span style={{ color: '#86868b' }}>FL-152562603</span></div>
                <div>{isRTL ? 'رقم التوثيق:' : 'Cert No.'} <span style={{ color: '#86868b' }}>0000195910</span></div>
                <div style={{ marginTop: 8, color: '#86868b' }}>
                  {isRTL ? 'حاتم حماد السفياني' : 'Hatim Hammad Al-Sfyani'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{
            paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <p style={{ fontSize: 13, color: '#6e6e73' }}>
              © {new Date().getFullYear()} Sirati — {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
            <p style={{ fontSize: 12, color: '#48484a' }}>sirati.sa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
