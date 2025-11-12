export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          candidate_accepted: boolean | null
          candidate_id: string
          completed_at: string | null
          contract_status: Database["public"]["Enums"]["contract_status"] | null
          created_at: string
          end_date: string | null
          id: string
          job_id: string
          start_date: string | null
          status: string
        }
        Insert: {
          candidate_accepted?: boolean | null
          candidate_id: string
          completed_at?: string | null
          contract_status?:
            | Database["public"]["Enums"]["contract_status"]
            | null
          created_at?: string
          end_date?: string | null
          id?: string
          job_id: string
          start_date?: string | null
          status?: string
        }
        Update: {
          candidate_accepted?: boolean | null
          candidate_id?: string
          completed_at?: string | null
          contract_status?:
            | Database["public"]["Enums"]["contract_status"]
            | null
          created_at?: string
          end_date?: string | null
          id?: string
          job_id?: string
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          about: string | null
          city: string | null
          cnpj: string
          created_at: string
          description: string | null
          essential_skills: string[] | null
          fantasy_name: string
          id: string
          is_active: boolean
          logo_url: string | null
          rating: number | null
          sector: string | null
          seeking: string | null
          state: string | null
          testimonials: Json | null
          total_ratings: number | null
          training: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string | null
          city?: string | null
          cnpj: string
          created_at?: string
          description?: string | null
          essential_skills?: string[] | null
          fantasy_name: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          rating?: number | null
          sector?: string | null
          seeking?: string | null
          state?: string | null
          testimonials?: Json | null
          total_ratings?: number | null
          training?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string | null
          city?: string | null
          cnpj?: string
          created_at?: string
          description?: string | null
          essential_skills?: string[] | null
          fantasy_name?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          rating?: number | null
          sector?: string | null
          seeking?: string | null
          state?: string | null
          testimonials?: Json | null
          total_ratings?: number | null
          training?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company_id: string
          created_at: string
          description: string
          id: string
          is_remote: boolean | null
          job_type: string
          location: string
          required_experience_level: string | null
          required_github_level: string | null
          required_specialization_areas: string[] | null
          requirements: string | null
          salary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          id?: string
          is_remote?: boolean | null
          job_type: string
          location: string
          required_experience_level?: string | null
          required_github_level?: string | null
          required_specialization_areas?: string[] | null
          requirements?: string | null
          salary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          is_remote?: boolean | null
          job_type?: string
          location?: string
          required_experience_level?: string | null
          required_github_level?: string | null
          required_specialization_areas?: string[] | null
          requirements?: string | null
          salary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          candidate_id: string
          company_id: string
          id: string
          job_id: string
          matched_at: string
          status: string
        }
        Insert: {
          candidate_id: string
          company_id: string
          id?: string
          job_id: string
          matched_at?: string
          status?: string
        }
        Update: {
          candidate_id?: string
          company_id?: string
          id?: string
          job_id?: string
          matched_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_matches_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about_me: string | null
          city: string | null
          created_at: string
          education: string | null
          experience: string | null
          experience_level: string | null
          full_name: string
          gender: string | null
          github_level: string | null
          id: string
          is_active: boolean
          is_lgbt: boolean | null
          is_pcd: boolean | null
          journey: string | null
          linkedin_url: string | null
          opportunity_type: string[] | null
          pcd_type: string | null
          photo_url: string | null
          rating: number | null
          remote_preference: string | null
          resume_url: string | null
          social_name: string | null
          specialization_areas: string[] | null
          state: string | null
          total_ratings: number | null
          updated_at: string
          work_area: string | null
        }
        Insert: {
          about_me?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          experience?: string | null
          experience_level?: string | null
          full_name: string
          gender?: string | null
          github_level?: string | null
          id: string
          is_active?: boolean
          is_lgbt?: boolean | null
          is_pcd?: boolean | null
          journey?: string | null
          linkedin_url?: string | null
          opportunity_type?: string[] | null
          pcd_type?: string | null
          photo_url?: string | null
          rating?: number | null
          remote_preference?: string | null
          resume_url?: string | null
          social_name?: string | null
          specialization_areas?: string[] | null
          state?: string | null
          total_ratings?: number | null
          updated_at?: string
          work_area?: string | null
        }
        Update: {
          about_me?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          experience?: string | null
          experience_level?: string | null
          full_name?: string
          gender?: string | null
          github_level?: string | null
          id?: string
          is_active?: boolean
          is_lgbt?: boolean | null
          is_pcd?: boolean | null
          journey?: string | null
          linkedin_url?: string | null
          opportunity_type?: string[] | null
          pcd_type?: string | null
          photo_url?: string | null
          rating?: number | null
          remote_preference?: string | null
          resume_url?: string | null
          social_name?: string | null
          specialization_areas?: string[] | null
          state?: string | null
          total_ratings?: number | null
          updated_at?: string
          work_area?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          application_id: string
          comment: string | null
          created_at: string | null
          id: string
          rated_user_id: string
          rater_id: string
          rating: number
        }
        Insert: {
          application_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_user_id: string
          rater_id: string
          rating: number
        }
        Update: {
          application_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_user_id?: string
          rater_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          action: string
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          application_id: string
          candidate_id: string
          comment: string
          company_id: string
          created_at: string
          id: string
          job_title: string
          status: string
          updated_at: string
        }
        Insert: {
          application_id: string
          candidate_id: string
          comment: string
          company_id: string
          created_at?: string
          id?: string
          job_title: string
          status?: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          candidate_id?: string
          comment?: string
          company_id?: string
          created_at?: string
          id?: string
          job_title?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_candidate_contact_info: {
        Args: { _candidate_id: string }
        Returns: {
          email: string
          linkedin_url: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "candidate" | "company" | "admin"
      contract_status: "pending" | "active" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["candidate", "company", "admin"],
      contract_status: ["pending", "active", "completed", "cancelled"],
    },
  },
} as const
