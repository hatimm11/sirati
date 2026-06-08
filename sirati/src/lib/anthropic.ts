import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ── Types ─────────────────────────────────────────
export interface UserProfile {
  name_ar: string | null;
  name_en: string | null;
  phone: string | null;
  title_ar: string | null;
  title_en: string | null;
  city: string | null;
  country: string | null;
  linkedin: string | null;
  portfolio_url: string | null;
  summary_ar: string | null;
  summary_en: string | null;
}

export interface WorkExperience {
  company_ar: string | null;
  company_en: string | null;
  role_ar: string;
  role_en: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description_ar: string | null;
  description_en: string | null;
}

export interface Education {
  institution: string;
  degree_ar: string | null;
  degree_en: string | null;
  field_ar: string | null;
  field_en: string | null;
  start_year: number | null;
  end_year: number | null;
}

export interface Skill {
  name: string;
  level: string | null;
  category: string | null;
}

export interface Language {
  language: string;
  proficiency: string | null;
}

export interface Certification {
  name: string;
  issuer: string | null;
  issue_date: string | null;
}

export interface GenerateCVInput {
  jobTitle: string;
  jobDescription: string;
  language: 'ar' | 'en' | 'both';
  tone: 'formal' | 'creative' | 'technical';
  profile: UserProfile;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  userEmail: string;
}

export interface GeneratedCV {
  language: 'ar' | 'en' | 'both';
  ar?: CVContent;
  en?: CVContent;
  matchScore: number;
  keywordsMatched: string[];
  suggestions: string[];
}

export interface CVContent {
  name: string;
  title: string;
  contact: {
    email: string;
    phone?: string;
    city?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
  skills: { category: string; items: string[] }[];
  languages: { language: string; level: string }[];
  certifications: { name: string; issuer: string; date: string }[];
  coverLetter: string;
}

// ── Main generation function ──────────────────────
export async function generateCV(input: GenerateCVInput): Promise<GeneratedCV> {
  const systemPrompt = `أنت خبير في كتابة السير الذاتية الاحترافية. مهمتك تحليل بيانات المستخدم والوصف الوظيفي، ثم توليد سيرة ذاتية مخصصة ومحترفة تناسب الوظيفة تحديداً.

القواعد:
- حلّل الوصف الوظيفي واستخرج المهارات والمتطلبات الأساسية
- رتّب الخبرات والمهارات حسب أهميتها للوظيفة المطلوبة
- اكتب ملخصاً مخصصاً يُبرز توافق المرشح مع الوظيفة
- تأكد أن الكلمات المفتاحية ATS موجودة بشكل طبيعي
- استخدم أفعالاً قوية في بداية كل إنجاز (أطلقت، طوّرت، أدرت، حققت)
- الناتج يجب أن يكون JSON صالح فقط بدون أي نص خارجه`;

  const userPrompt = buildPrompt(input);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  // Extract JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');

  return JSON.parse(jsonMatch[0]) as GeneratedCV;
}

function buildPrompt(input: GenerateCVInput): string {
  const {
    jobTitle, jobDescription, language, tone,
    profile, workExperience, education, skills, languages, certifications, userEmail,
  } = input;

  const toneMap = {
    formal: 'رسمي ومحترف تماماً',
    creative: 'إبداعي وجذاب مع الحفاظ على المهنية',
    technical: 'تقني ودقيق مع إبراز الجانب التقني',
  };

  return `
## الوظيفة المطلوبة
العنوان: ${jobTitle}
الأسلوب المطلوب: ${toneMap[tone]}

## الوصف الوظيفي
${jobDescription}

## بيانات المرشح
البريد: ${userEmail}
الاسم (عربي): ${profile.name_ar || 'غير محدد'}
الاسم (إنجليزي): ${profile.name_en || 'غير محدد'}
المسمى الحالي: ${profile.title_ar || profile.title_en || 'غير محدد'}
الهاتف: ${profile.phone || 'غير محدد'}
المدينة: ${profile.city || ''}, ${profile.country || ''}
LinkedIn: ${profile.linkedin || 'غير محدد'}
Portfolio: ${profile.portfolio_url || 'غير محدد'}
الملخص الحالي: ${profile.summary_ar || 'غير محدد'}

## الخبرات الوظيفية
${workExperience.map((w) => `
- الشركة: ${w.company_ar || w.company_en}
  المسمى: ${w.role_ar || w.role_en}
  الفترة: ${w.start_date} - ${w.is_current ? 'حتى الآن' : w.end_date || ''}
  الوصف: ${w.description_ar || w.description_en || ''}
`).join('')}

## التعليم
${education.map((e) => `- ${e.institution}: ${e.degree_ar || e.degree_en} في ${e.field_ar || e.field_en || ''} (${e.start_year}-${e.end_year || 'حتى الآن'})`).join('\n')}

## المهارات
${skills.map((s) => `${s.name} (${s.level || ''}) - ${s.category || ''}`).join(', ')}

## اللغات
${languages.map((l) => `${l.language}: ${l.proficiency || ''}`).join(', ')}

## الشهادات والدورات
${certifications.map((c) => `${c.name} - ${c.issuer || ''} (${c.issue_date || ''})`).join('\n')}

## المطلوب
أعد JSON بالهيكل التالي بالضبط:
{
  "language": "${language}",
  "matchScore": <رقم من 0 إلى 100>,
  "keywordsMatched": ["<كلمة مفتاحية>"],
  "suggestions": ["<اقتراح لتحسين الملف>"],
  ${language === 'ar' || language === 'both' ? `"ar": {
    "name": "<الاسم>",
    "title": "<المسمى الوظيفي المخصص>",
    "contact": { "email": "${userEmail}", "phone": "", "city": "", "linkedin": "", "portfolio": "" },
    "summary": "<ملخص احترافي مخصص للوظيفة 3-4 جمل>",
    "experience": [{ "company": "", "role": "", "period": "", "bullets": ["<إنجاز 1>", "<إنجاز 2>", "<إنجاز 3>"] }],
    "education": [{ "institution": "", "degree": "", "period": "" }],
    "skills": [{ "category": "<فئة>", "items": ["<مهارة>"] }],
    "languages": [{ "language": "", "level": "" }],
    "certifications": [{ "name": "", "issuer": "", "date": "" }],
    "coverLetter": "<خطاب تغطية مخصص 3 فقرات>"
  }` : ''}
  ${language === 'en' || language === 'both' ? `${language === 'both' ? ',' : ''}"en": {
    "name": "<Full Name>",
    "title": "<Customized Job Title>",
    "contact": { "email": "${userEmail}", "phone": "", "city": "", "linkedin": "", "portfolio": "" },
    "summary": "<Professional summary tailored to the job 3-4 sentences>",
    "experience": [{ "company": "", "role": "", "period": "", "bullets": ["<Achievement 1>", "<Achievement 2>", "<Achievement 3>"] }],
    "education": [{ "institution": "", "degree": "", "period": "" }],
    "skills": [{ "category": "<category>", "items": ["<skill>"] }],
    "languages": [{ "language": "", "level": "" }],
    "certifications": [{ "name": "", "issuer": "", "date": "" }],
    "coverLetter": "<Customized cover letter 3 paragraphs>"
  }` : ''}
}`;
}
