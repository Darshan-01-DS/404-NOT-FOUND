export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "won";

export type CourseLevel =
  | "Class 9"
  | "Class 10"
  | "Class 11"
  | "Class 12"
  | "UG"
  | "PG"
  | "PhD"
  | "Diploma";

export type Category =
  | "General"
  | "OBC"
  | "SC"
  | "ST"
  | "EWS"
  | "PwD";

export type Gender = "Male" | "Female" | "Transgender" | "Any";

export type IncomeRange =
  | "<1L"
  | "1-2.5L"
  | "2.5-5L"
  | "5-8L"
  | ">8L";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          profile_complete: boolean;
        };
        Insert: {
          id?: string;
          phone: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          profile_complete?: boolean;
        };
        Update: {
          id?: string;
          phone?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          profile_complete?: boolean;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          course_level: CourseLevel | null;
          field: string | null;
          year: number | null;
          institution: string | null;
          percentage: number | null;
          category: Category | null;
          gender: Gender | null;
          religion: string | null;
          state: string | null;
          income_range: IncomeRange | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_level?: CourseLevel | null;
          field?: string | null;
          year?: number | null;
          institution?: string | null;
          percentage?: number | null;
          category?: Category | null;
          gender?: Gender | null;
          religion?: string | null;
          state?: string | null;
          income_range?: IncomeRange | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      scholarships: {
        Row: {
          id: string;
          name: string;
          provider: string;
          provider_type: "Government" | "Corporate" | "NGO" | "International" | "University";
          amount: number;
          deadline: string;
          course_levels: CourseLevel[];
          categories: Category[];
          genders: Gender[];
          states: string[];
          religions: string[];
          min_percentage: number | null;
          description: string;
          documents_required: string[];
          apply_url: string;
          is_featured: boolean;
          created_at: string;
          field_tags: string[];
          emoji: string;
        };
        Insert: Omit<Database["public"]["Tables"]["scholarships"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["scholarships"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          scholarship_id: string;
          status: ApplicationStatus;
          applied_at: string | null;
          deadline: string | null;
          notes: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["applications"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          doc_type: string;
          file_url: string | null;
          file_size_bytes: number | null;
          uploaded_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documents"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          scholarship_id: string;
          notify_before_days: number;
          added_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["watchlist"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["watchlist"]["Insert"]>;
      };
      sops: {
        Row: {
          id: string;
          user_id: string;
          scholarship_id: string | null;
          content: string;
          language: "en" | "hi" | "mr";
          score: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sops"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["sops"]["Insert"]>;
      };
    };
  };
}

// Convenience types
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ScholarshipRow = Database["public"]["Tables"]["scholarships"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type WatchlistRow = Database["public"]["Tables"]["watchlist"]["Row"];
export type SopRow = Database["public"]["Tables"]["sops"]["Row"];
