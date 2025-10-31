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
      applications: {
        Row: {
          candidate_id: string
          completed_at: string | null
          contract_status: Database["public"]["Enums"]["contract_status"] | null
          created_at: string
          id: string
          job_id: string
          status: string
        }
        Insert: {
          candidate_id: string
          completed_at?: string | null
          contract_status?:
            | Database["public"]["Enums"]["contract_status"]
            | null
          created_at?: string
          id?: string
          job_id: string
          status?: string
        }
        Update: {
          candidate_id?: string
          completed_at?: string | null
          contract_status?:
            | Database["public"]["Enums"]["contract_status"]
            | null
          created_at?: string
          id?: string
          job_id?: string
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
          job_type: string
          location: string
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
          job_type: string
          location: string
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
          job_type?: string
          location?: string
          requirements?: string | null
          salary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          full_name: string
          gender: string | null
          id: string
          is_active: boolean
          journey: string | null
          linkedin_url: string | null
          photo_url: string | null
          rating: number | null
          resume_url: string | null
          state: string | null
          total_ratings: number | null
          updated_at: string
        }
        Insert: {
          about_me?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          experience?: string | null
          full_name: string
          gender?: string | null
          id: string
          is_active?: boolean
          journey?: string | null
          linkedin_url?: string | null
          photo_url?: string | null
          rating?: number | null
          resume_url?: string | null
          state?: string | null
          total_ratings?: number | null
          updated_at?: string
        }
        Update: {
          about_me?: string | null
          city?: string | null
          created_at?: string
          education?: string | null
          experience?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean
          journey?: string | null
          linkedin_url?: string | null
          photo_url?: string | null
          rating?: number | null
          resume_url?: string | null
          state?: string | null
          total_ratings?: number | null
          updated_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "candidate" | "company"
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
      app_role: ["candidate", "company"],
      contract_status: ["pending", "active", "completed", "cancelled"],
    },
  },
} as const
