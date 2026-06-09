'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function DashboardPage() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, lastScore: 0 });

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('generated_cvs')
          .select('match_score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        const rows = data as any[];
        if (rows) {
          setStats({
            total: rows.length,
            lastScore: rows[0]?.match_score || 0,
          });
        }
      }
    }
    load();
  }, []);

  if (!mounted) {
    return (
      <div style={{ padding: '40px 48px', maxWidth: 900, minHeight: '100vh' }}>
        <div style={{ height: 40, width: 280, background: '#f0f0f0', borderRadius: 10, marginBottom: 16 }} />
        <div style={{ height: 20, width: 220, background: '#f5f5f5', borderRadius: 8, marginBottom: 40 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', height: 120 }} />
          ))}
        </div>
        <div style={{ background: '#f0f0f0', borderRadius: 20, height: 140, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[1,2].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, height: 110, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} />
          ))}
        </div>
      </div>
    );
  }

  const isRTL = locale === 'ar';
  const p = (path: string) => isRTL ? `/ar${path}` : `/en${path}`;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
          {isRTL ? `مرحباً ${user?.user_metadata?.full_name?.split(' ')[0] || ''} 👋` : `Welcome ${user?.user_metadata?.full_name?.split(' ')[0] || ''} 👋`}
        </h1>
        <p style={{ color: '#86868b', marginTop: 8, fontSize: 16 }}>
          {isRTL ? 'جاهز لبناء سيرتك الذاتية المثالية؟' : 'Ready to build your perfect CV?'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: isRTL ? 'السير المُولَّدة' : 'CVs Generated', value: stats.total, icon: '📄' },
          { label: isRTL ? 'آخر نسبة توافق' : 'Last Match Score', value: stats.lastScore ? `${stats.lastScore}%` : '—', icon: '🎯' },
          { label: isRTL ? 'الحالة' : 'Status', value: isRTL ? 'نشط' : 'Active', icon: '✅' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: 16, padding: '24px 28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f' }}>{stat.value}</div>
            <div style={{ fontSize: 14, color: '#86868b', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #0071e3, #2997ff)',
        borderRadius: 20, padding: '36px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: isRTL ? 'row' : 'row-reverse',
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
            {isRTL ? 'ابدأ بتوليد سيرتك الذاتية' : 'Generate Your CV Now'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8, fontSize: 15 }}>
            {isRTL ? 'أدخل وصف الوظيفة وكلاود يبني لك سيرة ذاتية احترافية' : 'Enter a job description and Claude will craft your perfect CV'}
          </p>
        </div>
        <Link href={p('/generate')} style={{
          background: '#fff', color: '#0071e3',
          padding: '14px 28px', borderRadius: 12,
          fontWeight: 700, fontSize: 15, textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
          marginLeft: isRTL ? 0 : 24,
        }}>
          {isRTL ? 'توليد CV ✨' : 'Generate CV ✨'}
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        {[
          { href: p('/profile'), icon: '👤', title: isRTL ? 'ملفي الشخصي' : 'My Profile', desc: isRTL ? 'أضف بياناتك وخبراتك' : 'Add your info and experience' },
          { href: p('/history'), icon: '📂', title: isRTL ? 'السير المحفوظة' : 'Saved CVs', desc: isRTL ? 'استعرض سيرك السابقة' : 'Browse your previous CVs' },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            background: '#fff', borderRadius: 16, padding: '24px 28px',
            textDecoration: 'none', display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>{item.title}</div>
            <div style={{ fontSize: 14, color: '#86868b', marginTop: 4 }}>{item.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
