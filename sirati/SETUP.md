# 🚀 دليل تشغيل سيرتي — Sirati Setup Guide

## الخطوات بالترتيب

### 1. تثبيت المتطلبات

```bash
cd sirati
npm install
```

### 2. إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com) → New Project
2. في **SQL Editor** الصق محتوى `supabase/schema.sql` واضغط Run
3. في **Authentication → Providers** فعّل Google
4. في **Project Settings → API** انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. إعداد Anthropic

1. اذهب إلى [console.anthropic.com](https://console.anthropic.com)
2. أنشئ API Key
3. احفظه في → `ANTHROPIC_API_KEY`

### 4. إعداد ملف البيئة

```bash
cp .env.local.example .env.local
# عدّل القيم في .env.local
```

### 5. تشغيل محلياً

```bash
npm run dev
# الموقع يعمل على: http://localhost:3000
```

### 6. النشر على Vercel

```bash
# 1. رفع على GitHub
git init && git add . && git commit -m "feat: sirati initial"
git remote add origin https://github.com/YOUR_USERNAME/sirati
git push -u origin main

# 2. vercel.com → Import → اختر الـ repo
# 3. أضف Environment Variables
# 4. Deploy
```

### 7. ربط الدومين

في Vercel → Settings → Domains → أضف `sirati.sa`
في مزود الدومين أضف:
```
CNAME  @  cname.vercel-dns.com
CNAME  www  cname.vercel-dns.com
```

---

## هيكل الملفات

```
sirati/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              ← الصفحة الرئيسية
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx        ← الـ Sidebar
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── generate/page.tsx ← توليد CV ← الأهم
│   │   │       ├── profile/page.tsx
│   │   │       └── history/page.tsx
│   │   └── api/
│   │       ├── generate-cv/route.ts  ← Claude API
│   │       ├── generate-pdf/route.ts ← PDF
│   │       └── auth/callback/route.ts
│   ├── lib/
│   │   ├── anthropic.ts              ← منطق الذكاء الاصطناعي
│   │   ├── supabase.ts               ← قاعدة البيانات
│   │   └── database.types.ts
│   ├── i18n/
│   │   ├── request.ts
│   │   └── messages/
│   │       ├── ar.json               ← النصوص العربية
│   │       └── en.json               ← النصوص الإنجليزية
│   └── middleware.ts                 ← Auth + i18n
├── supabase/
│   └── schema.sql                    ← قاعدة البيانات
├── .env.local.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## الميزات المبنية

- [x] صفحة رئيسية بهوية Apple
- [x] تسجيل الدخول / إنشاء حساب
- [x] مصادقة Google OAuth
- [x] توليد CV بـ Claude AI
- [x] دعم عربي/إنجليزي (RTL كامل)
- [x] نسبة التوافق مع الوظيفة
- [x] خطاب تغطية تلقائي
- [x] اقتراحات تحسين
- [x] قاعدة بيانات Supabase
- [x] Row Level Security

## الميزات التالية

- [ ] صفحة الملف الشخصي (profile/page.tsx)
- [ ] صفحة السير المحفوظة (history/page.tsx)
- [ ] توليد PDF (api/generate-pdf)
- [ ] قوالب PDF متعددة
- [ ] بوابة الدفع (آخراً)
