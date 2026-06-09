'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 48px', maxWidth: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>حدث خطأ</h2>
        <p style={{ fontSize: 14, color: '#86868b', marginBottom: 24 }}>{error.message || 'Unknown error'}</p>
        <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#0071e3', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          حاول مجدداً
        </button>
      </div>
    </div>
  );
}
