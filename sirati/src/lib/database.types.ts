export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name_ar: string | null;
          name_en: string | null;
          phone: string | null;
          avatar_url: string | null;
          title_ar: string | null;
          title_en: string | null;
          summary_ar: string | null;
          summary_en: string | null;
          city: string | null;
          country: string | null;
          linkedin: string | null;
          portfolio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      work_experience: {
        Row: {
          id: string;
          user_id: string;
          company_ar: string | null;
          company_en: string | null;
          role_ar: string;
          role_en: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description_ar: string | null;
          description_en: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['work_experience']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['work_experience']['Insert']>;
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          degree_ar: string | null;
          degree_en: string | null;
          field_ar: string | null;
          field_en: string | null;
          start_year: number | null;
          end_year: number | null;
          gpa: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['education']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['education']['Insert']>;
      };
      certifications: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          issuer: string | null;
          issue_date: string | null;
          expiry_date: string | null;
          credential_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['certifications']['Insert']>;
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
          category: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['skills']['Insert']>;
      };
      languages: {
        Row: {
          id: string;
          user_id: string;
          language: string;
          proficiency: 'elementary' | 'limited' | 'professional' | 'full' | 'native' | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['languages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['languages']['Insert']>;
      };
      generated_cvs: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          job_description: string;
          language: 'ar' | 'en' | 'both';
          tone: 'formal' | 'creative' | 'technical';
          content_json: Json;
          cover_letter: string | null;
          match_score: number | null;
          pdf_url: string | null;
          template_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['generated_cvs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['generated_cvs']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
