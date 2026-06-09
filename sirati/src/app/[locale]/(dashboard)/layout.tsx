'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';

function SidebarLink({ href, icon, label, active }: {
  href: string; icon: string; label: string; active?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
        fontSize: 15, fontWeight: 500,
        color: active ? '#0071e3' : '#6e6e73',
        background: active ? 'rgba(0,113,227,0.08)' : 'transparent',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = 'rgba(0,0,0,0.04)'); }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = 'transparent'); }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = locale === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const p = (path: string) => isRTL ? `/ar${path}` : `/en${path}`;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(isRTL ? '/ar' : '/en');
  }

  const navItems = [
    { href: p('/dashboard'), icon: '⚡', label: isRTL ? 'الرئيسية' : 'Dashboard' },
    { href: p('/generate'), icon: '✨', label: isRTL ? 'توليد سيرة ذاتية' : 'Generate CV' },
    { href: p('/history'), icon: '📂', label: isRTL ? 'السير المحفوظة' : 'Saved CVs' },
    { href: p('/profile'), icon: '👤', label: isRTL ? 'ملفي الشخصي' : 'My Profile' },
  ];

  if (!mounted) {
    return (
      <div style={{
        display: 'flex', minHeight: '100vh',
        background: '#f5f5f7',
        fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
      }}>
        <div style={{
          width: 240, flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid rgba(0,0,0,0.06)',
        }} />
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f5f5f7',
      fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
      direction: isRTL ? 'rtl' : 'ltr',
    }}>
      <aside style={{
        width: 240, flexShrink: 0,
        background: '#fff',
        borderRight: isRTL ? 'none' : '1px solid rgba(0,0,0,0.06)',
        borderLeft: isRTL ? '1px solid rgba(0,0,0,0.06)' : 'none',
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <Link href={isRTL ? '/ar' : '/en'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '0 6px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #0071e3, #2997ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff',
          }}>س</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1d1d1f' }}>
            {isRTL ? 'سيرتي' : 'Sirati'}
          </span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href || pathname.startsWith(item.href + '/')}
            />
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 10, border: 'none',
            background: 'transparent', cursor: 'pointer',
            fontSize: 15, fontWeight: 500, color: '#86868b',
            width: '100%', fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,48,0.06)'; e.currentTarget.style.color = '#ff3b30'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#86868b'; }}
        >
          <span style={{ fontSize: 20 }}>🚪</span>
          {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
        </button>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
