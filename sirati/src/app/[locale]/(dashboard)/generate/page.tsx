'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

type Tone = 'formal' | 'creative' | 'technical';
type Lang = 'ar' | 'en' | 'both';

interface CVResult {
  matchScore: number;
  keywordsMatched: string[];
  suggestions: string[];
  ar?: {
    name: string; title: string; summary: string;
    experience: { company: string; role: string; period: string; bullets: string[] }[];
    skills: { category: string; items: string[] }[];
    coverLetter: string;
  };
  en?: {
    name: string; title: string; summary: string;
    experience: { company: string; role: string; period: string; bullets: string[] }[];
    skills: { category: string; items: string[] }[];
    coverLetter: string;
  };
}

export default function GeneratePage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [language, setLanguage] = useState<Lang>('ar');
  const [tone, setTone] = useState<Tone>('formal');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CVResult | null>(null);
  const [activeTab, setActiveTab] = useState<'cv' | 'cover' | 'tips'>('cv');
  const [showLang, setShowLang] = useState<'ar' | 'en'>('ar');

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDesc.trim()) {
      toast.error(isRTL ? 'أدخل المسمى الوظيفي والوصف' : 'Enter job title and description');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, jobDescription: jobDesc, language, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data.cv);
      setShowLang(language === 'en' ? 'en' : 'ar');
      toast.success(isRTL ? 'تم توليد سيرتك الذاتية!' : 'CV generated!');
    } catch (err) {
      toast.error(isRTL ? 'حدث خطأ أثناء التوليد' : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    toast.info(isRTL ? 'جارٍ تجهيز الـ PDF...' : 'Preparing PDF...');
    // PDF generation endpoint
    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cv: result, language: showLang }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${jobTitle.replace(/\s/g, '_')}_${showLang}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  const cvContent = showLang === 'ar' ? result?.ar : result?.en;
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.1)',
    background: '#f5f5f7', fontSize: 15, outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  };

  return (
    <div style={{ padding: '40px 40px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>
          {isRTL ? 'توليد سيرة ذاتية' : 'Generate CV'}
        </h1>
        <p style={{ fontSize: 16, color: '#6e6e73', marginBottom: 40 }}>
          {isRTL
            ? 'أدخل الوصف الوظيفي وسيتولى الذكاء الاصطناعي بناء سيرتك بشكل مخصص'
            : 'Paste the job description and AI will build your tailored CV'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* Form */}
          <form onSubmit={handleGenerate} style={{
            background: '#fff', borderRadius: 20, padding: '32px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: 20, alignSelf: 'start',
          }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: 8 }}>
                {isRTL ? 'المسمى الوظيفي' : 'Job Title'}
              </label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={isRTL ? 'مثال: مطور واجهة أمامية' : 'e.g. Frontend Developer'}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#0071e3'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = '#f5f5f7'; }}
              />
            </div>

            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: 8 }}>
                {isRTL ? 'الوصف الوظيفي' : 'Job Description'}
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder={isRTL ? 'الصق الوصف الوظيفي كاملاً هنا...' : 'Paste the full job description here...'}
                rows={8}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#0071e3'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = '#f5f5f7'; }}
              />
            </div>

            {/* Language */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: 10 }}>
                {isRTL ? 'لغة السيرة الذاتية' : 'CV Language'}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {([['ar', isRTL ? 'عربي' : 'Arabic'], ['en', isRTL ? 'إنجليزي' : 'English'], ['both', isRTL ? 'كلاهما' : 'Both']] as [Lang, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLanguage(val)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
                      background: language === val ? '#0071e3' : '#f5f5f7',
                      color: language === val ? '#fff' : '#6e6e73',
                      transition: 'all 0.15s',
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: 10 }}>
                {isRTL ? 'أسلوب الكتابة' : 'Writing Style'}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {([['formal', isRTL ? 'رسمي' : 'Formal'], ['creative', isRTL ? 'إبداعي' : 'Creative'], ['technical', isRTL ? 'تقني' : 'Technical']] as [Tone, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTone(val)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
                      background: tone === val ? 'rgba(0,113,227,0.1)' : '#f5f5f7',
                      color: tone === val ? '#0071e3' : '#6e6e73',
                      transition: 'all 0.15s',
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '16px', borderRadius: 12, border: 'none',
                background: loading ? '#86868b' : 'linear-gradient(135deg, #0071e3, #2997ff)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                  {isRTL ? 'جارٍ التوليد...' : 'Generating...'}
                </>
              ) : (
                <>{isRTL ? '✨ توليد السيرة الذاتية' : '✨ Generate CV'}</>
              )}
            </button>
          </form>

          {/* Result */}
          {result && cvContent && (
            <div style={{
              background: '#fff', borderRadius: 20,
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '20px 28px', borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['cv', 'cover', 'tips'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
                        background: activeTab === tab ? '#0071e3' : '#f5f5f7',
                        color: activeTab === tab ? '#fff' : '#6e6e73',
                      }}
                    >
                      {tab === 'cv' ? (isRTL ? 'السيرة' : 'CV') :
                       tab === 'cover' ? (isRTL ? 'خطاب تغطية' : 'Cover Letter') :
                       (isRTL ? 'اقتراحات' : 'Tips')}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Match score */}
                  <div style={{
                    padding: '6px 14px', borderRadius: 20,
                    background: result.matchScore >= 70 ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)',
                    color: result.matchScore >= 70 ? '#34c759' : '#ff9500',
                    fontSize: 13, fontWeight: 600,
                  }}>
                    {result.matchScore}% {isRTL ? 'توافق' : 'match'}
                  </div>

                  {language === 'both' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['ar', 'en'] as const).map((l) => (
                        <button key={l} onClick={() => setShowLang(l)} style={{
                          padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                          fontSize: 13, fontFamily: 'inherit',
                          background: showLang === l ? '#1d1d1f' : '#f5f5f7',
                          color: showLang === l ? '#fff' : '#6e6e73',
                        }}>{l.toUpperCase()}</button>
                      ))}
                    </div>
                  )}

                  <button onClick={handleDownloadPDF} style={{
                    padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: '#0071e3', color: '#fff', fontSize: 13, fontWeight: 600,
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    ↓ PDF
                  </button>
                </div>
              </div>

              {/* CV Preview */}
              <div style={{
                padding: '28px', maxHeight: '70vh', overflowY: 'auto',
                direction: showLang === 'ar' ? 'rtl' : 'ltr',
                fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
              }}>
                {activeTab === 'cv' && (
                  <div>
                    <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', marginBottom: 4 }}>{cvContent.name}</h2>
                    <p style={{ fontSize: 16, color: '#0071e3', fontWeight: 500, marginBottom: 16 }}>{cvContent.title}</p>

                    <div style={{ padding: '16px', background: '#f5f5f7', borderRadius: 12, marginBottom: 24 }}>
                      <p style={{ fontSize: 15, color: '#1d1d1f', lineHeight: 1.7 }}>{cvContent.summary}</p>
                    </div>

                    {cvContent.experience?.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14, borderBottom: '2px solid rgba(0,113,227,0.15)', paddingBottom: 8 }}>
                          {showLang === 'ar' ? 'الخبرة المهنية' : 'Work Experience'}
                        </h3>
                        {cvContent.experience.map((exp, i) => (
                          <div key={i} style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                              <div>
                                <span style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f' }}>{exp.role}</span>
                                <span style={{ fontSize: 15, color: '#6e6e73' }}> · {exp.company}</span>
                              </div>
                              <span style={{ fontSize: 13, color: '#86868b' }}>{exp.period}</span>
                            </div>
                            <ul style={{ paddingRight: showLang === 'ar' ? 20 : 0, paddingLeft: showLang === 'en' ? 20 : 0 }}>
                              {exp.bullets.map((b, j) => (
                                <li key={j} style={{ fontSize: 14, color: '#1d1d1f', marginBottom: 6, lineHeight: 1.6 }}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {cvContent.skills?.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14, borderBottom: '2px solid rgba(0,113,227,0.15)', paddingBottom: 8 }}>
                          {showLang === 'ar' ? 'المهارات' : 'Skills'}
                        </h3>
                        {cvContent.skills.map((sg, i) => (
                          <div key={i} style={{ marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#6e6e73' }}>{sg.category}: </span>
                            <span style={{ fontSize: 14, color: '#1d1d1f' }}>{sg.items.join(' · ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'cover' && (
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1d1d1f', marginBottom: 16 }}>
                      {showLang === 'ar' ? 'خطاب التغطية' : 'Cover Letter'}
                    </h3>
                    <div style={{
                      fontSize: 15, color: '#1d1d1f', lineHeight: 1.9,
                      whiteSpace: 'pre-wrap',
                      background: '#f5f5f7', borderRadius: 14, padding: 20,
                    }}>
                      {cvContent.coverLetter}
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(cvContent.coverLetter); toast.success(isRTL ? 'تم النسخ' : 'Copied!'); }}
                      style={{
                        marginTop: 16, padding: '10px 20px', borderRadius: 10, border: 'none',
                        background: '#f5f5f7', color: '#1d1d1f', cursor: 'pointer',
                        fontSize: 14, fontFamily: 'inherit',
                      }}
                    >
                      {isRTL ? 'نسخ' : 'Copy'}
                    </button>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginBottom: 14 }}>
                        {isRTL ? 'الكلمات المفتاحية المطابقة' : 'Matched Keywords'}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {result.keywordsMatched.map((kw, i) => (
                          <span key={i} style={{
                            padding: '6px 12px', borderRadius: 20,
                            background: 'rgba(52,199,89,0.1)', color: '#34c759',
                            fontSize: 13, fontWeight: 500,
                          }}>{kw}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginBottom: 14 }}>
                        {isRTL ? 'اقتراحات للتحسين' : 'Improvement Suggestions'}
                      </h3>
                      {result.suggestions.map((s, i) => (
                        <div key={i} style={{
                          padding: '14px 16px', borderRadius: 12, marginBottom: 10,
                          background: '#f5f5f7', fontSize: 14, color: '#1d1d1f',
                          borderRight: '3px solid #0071e3',
                        }}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
