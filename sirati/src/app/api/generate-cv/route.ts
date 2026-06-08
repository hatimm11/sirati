import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { generateCV } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobTitle, jobDescription, language, tone } = body;

    if (!jobTitle || !jobDescription) {
      return NextResponse.json({ error: 'jobTitle and jobDescription are required' }, { status: 400 });
    }

    // Fetch user data in parallel
    const [profileRes, experienceRes, educationRes, skillsRes, languagesRes, certsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('work_experience').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('education').select('*').eq('user_id', user.id),
      supabase.from('skills').select('*').eq('user_id', user.id),
      supabase.from('languages').select('*').eq('user_id', user.id),
      supabase.from('certifications').select('*').eq('user_id', user.id),
    ]);

    // Generate CV with Claude
    const result = await generateCV({
      jobTitle,
      jobDescription,
      language: language || 'ar',
      tone: tone || 'formal',
      profile: profileRes.data || {},
      workExperience: experienceRes.data || [],
      education: educationRes.data || [],
      skills: skillsRes.data || [],
      languages: languagesRes.data || [],
      certifications: certsRes.data || [],
      userEmail: user.email!,
    });

    // Save to database
    const { data: savedCV, error: saveError } = await supabase
      .from('generated_cvs')
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        job_description: jobDescription,
        language: language || 'ar',
        tone: tone || 'formal',
        content_json: result,
        match_score: result.matchScore,
        template_id: 'modern-01',
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      // Return result even if save fails
    }

    return NextResponse.json({
      success: true,
      cv: result,
      id: savedCV?.id,
    });
  } catch (error) {
    console.error('Generate CV error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
