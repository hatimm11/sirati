import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { generateCV } from '@/lib/anthropic';
import type { UserProfile } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobTitle, jobDescription, language, tone } = body;

    if (!jobTitle || !jobDescription) {
      return NextResponse.json({ error: 'jobTitle and jobDescription are required' }, { status: 400 });
    }

    const [profileRes, experienceRes, educationRes, skillsRes, languagesRes, certsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('work_experience').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('education').select('*').eq('user_id', user.id),
      supabase.from('skills').select('*').eq('user_id', user.id),
      supabase.from('languages').select('*').eq('user_id', user.id),
      supabase.from('certifications').select('*').eq('user_id', user.id),
    ]);

    const emptyProfile: UserProfile = {
      name_ar: null, name_en: null, phone: null,
      title_ar: null, title_en: null, city: null,
      country: null, linkedin: null, portfolio_url: null,
      summary_ar: null, summary_en: null,
    };

    const result = await generateCV({
      jobTitle,
      jobDescription,
      language: language || 'ar',
      tone: tone || 'formal',
      profile: profileRes.data ?? emptyProfile,
      workExperience: experienceRes.data || [],
      education: educationRes.data || [],
      skills: skillsRes.data || [],
      languages: languagesRes.data || [],
      certifications: certsRes.data || [],
      userEmail: user.email!,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = {
      user_id: user.id,
      job_title: jobTitle,
      job_description: jobDescription,
      language: language || 'ar',
      tone: tone || 'formal',
      content_json: result,
      match_score: result.matchScore,
      template_id: 'modern-01',
    };

    const { data: savedCV, error: saveError } = await supabase
      .from('generated_cvs')
      .insert(insertData)
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
    }

    return NextResponse.json({
      success: true,
      cv: result,
      id: (savedCV as any)?.id,
    });
  } catch (error) {
    console.error('Generate CV error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
