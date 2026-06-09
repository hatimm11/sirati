'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f5f5f7' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 48px', maxWidth: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔴</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>Global Error</h2>
            <pre style={{ fontSize: 13, color: '#ff3b30', background: '#fff0f0', padding: '12px 16px', borderRadius: 8, textAlign: 'left', overflow: 'auto', marginBottom: 24, whiteSpace: 'pre-wrap' }}>
              {error.message}{error.digest ? `\nDigest: ${error.digest}` : ''}
            </pre>
            <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#0071e3', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
