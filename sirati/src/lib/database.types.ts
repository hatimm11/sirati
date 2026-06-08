export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; user_id: string; name_ar: string | null; name_en: string | null;
          phone: string | null; avatar_url: string | null; title_ar: string | null;
          title_en: string | null; summary_ar: string | null; summary_en: string | null;
          city: string | null; country: string | null; linkedin: string | null;
          portfolio_url: string | null; created_at: string; updated_at: string;
        };
        Insert: { user_id: string; name_ar?: string | null; name_en?: string | null; phone?: string | null; avatar_url?: string | null; title_ar?: string | null; title_en?: string | null; summary_ar?: string | null; summary_en?: string | null; city?: string | null; country?: string | null; linkedin?: string | null; portfolio_url?: string | null; };
        Update: { name_ar?: string | null; name_en?: string | null; phone?: string | null; avatar_url?: string | null; title_ar?: string | null; title_en?: string | null; summary_ar?: string | null; summary_en?: string | null; city?: string | null; country?: string | null; linkedin?: string | null; portfolio_url?: string | null; };
      };
      work_experience: {
        Row: { id: string; user_id: string; company_ar: string | null; company_en: string | null; role_ar: string; role_en: string | null; start_date: string; end_date: string | null; is_current: boolean; description_ar: string | null; description_en: string | null; sort_order: number; created_at: string; };
        Insert: { user_id: string; company_ar?: string | null; company_en?: string | null; role_ar: string; role_en?: string | null; start_date: string; end_date?: string | null; is_current?: boolean; description_ar?: string | null; description_en?: string | null; sort_order?: number; };
        Update: { company_ar?: string | null; company_en?: string | null; role_ar?: string; role_en?: string | null; start_date?: string; end_date?: string | null; is_current?: boolean; description_ar?: string | null; description_en?: string | null; sort_order?: number; };
      };
      education: {
        Row: { id: string; user_id: string; institution: string; degree_ar: string | null; degree_en: string | null; field_ar: string | null; field_en: string | null; start_year: number | null; end_year: number | null; gpa: string | null; created_at: string; };
        Insert: { user_id: string; institution: string; degree_ar?: string | null; degree_en?: string | null; field_ar?: string | null; field_en?: string | null; start_year?: number | null; end_year?: number | null; gpa?: string | null; };
        Update: { institution?: string; degree_ar?: string | null; degree_en?: string | null; field_ar?: string | null; field_en?: string | null; start_year?: number | null; end_year?: number | null; gpa?: string | null; };
      };
      certifications: {
        Row: { id: string; user_id: string; name: string; issuer: string | null; issue_date: string | null; expiry_date: string | null; credential_url: string | null; created_at: string; };
        Insert: { user_id: string; name: string; issuer?: string | null; issue_date?: string | null; expiry_date?: string | null; credential_url?: string | null; };
        Update: { name?: string; issuer?: string | null; issue_date?: string | null; expiry_date?: string | null; credential_url?: string | null; };
      };
      skills: {
        Row: { id: string; user_id: string; name: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null; category: string | null; created_at: string; };
        Insert: { user_id: string; name: string; level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null; category?: string | null; };
        Update: { name?: string; level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null; category?: string | null; };
      };
      languages: {
        Row: { id: string; user_id: string; language: string; proficiency: 'elementary' | 'limited' | 'professional' | 'full' | 'native' | null; created_at: string; };
        Insert: { user_id: string; language: string; proficiency?: 'elementary' | 'limited' | 'professional' | 'full' | 'native' | null; };
        Update: { language?: string; proficiency?: 'elementary' | 'limited' | 'professional' | 'full' | 'native' | null; };
      };
      generated_cvs: {
        Row: { id: string; user_id: string; job_title: string; job_description: string; language: 'ar' | 'en' | 'both'; tone: 'formal' | 'creative' | 'technical'; content_json: Json; cover_letter: string | null; match_score: number | null; pdf_url: string | null; template_id: string; created_at: string; };
        Insert: { user_id: string; job_title: string; job_description: string; language?: 'ar' | 'en' | 'both'; tone?: 'formal' | 'creative' | 'technical'; content_json: Json; cover_letter?: string | null; match_score?: number | null; pdf_url?: string | null; template_id?: string; };
        Update: { job_title?: string; job_description?: string; language?: 'ar' | 'en' | 'both'; tone?: 'formal' | 'creative' | 'technical'; content_json?: Json; cover_letter?: string | null; match_score?: number | null; pdf_url?: string | null; template_id?: string; };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
