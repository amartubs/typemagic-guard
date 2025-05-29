export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      authentication_attempts: {
        Row: {
          anomaly_details: Json | null
          confidence_score: number | null
          created_at: string
          id: string
          ip_address: unknown | null
          pattern_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          anomaly_details?: Json | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          pattern_id?: string | null
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          anomaly_details?: Json | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          pattern_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authentication_attempts_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "keystroke_patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authentication_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      biometric_profiles: {
        Row: {
          confidence_score: number
          created_at: string
          id: string
          last_updated: string
          pattern_count: number
          status: Database["public"]["Enums"]["biometric_status"]
          user_id: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          id?: string
          last_updated?: string
          pattern_count?: number
          status?: Database["public"]["Enums"]["biometric_status"]
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          id?: string
          last_updated?: string
          pattern_count?: number
          status?: Database["public"]["Enums"]["biometric_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "biometric_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      keystroke_patterns: {
        Row: {
          biometric_profile_id: string
          confidence_score: number | null
          context: string
          created_at: string
          id: string
          pattern_data: Json
          user_id: string
        }
        Insert: {
          biometric_profile_id: string
          confidence_score?: number | null
          context: string
          created_at?: string
          id?: string
          pattern_data: Json
          user_id: string
        }
        Update: {
          biometric_profile_id?: string
          confidence_score?: number | null
          context?: string
          created_at?: string
          id?: string
          pattern_data?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "keystroke_patterns_biometric_profile_id_fkey"
            columns: ["biometric_profile_id"]
            isOneToOne: false
            referencedRelation: "biometric_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keystroke_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          organization_name: string | null
          organization_size: number | null
          role: string
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          last_login?: string | null
          name: string
          organization_name?: string | null
          organization_size?: number | null
          role?: string
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          organization_name?: string | null
          organization_size?: number | null
          role?: string
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          anomaly_detection_sensitivity: number
          created_at: string
          enforce_two_factor: boolean
          id: string
          learning_period: number
          max_failed_attempts: number
          min_confidence_threshold: number
          security_level: Database["public"]["Enums"]["security_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          anomaly_detection_sensitivity?: number
          created_at?: string
          enforce_two_factor?: boolean
          id?: string
          learning_period?: number
          max_failed_attempts?: number
          min_confidence_threshold?: number
          security_level?: Database["public"]["Enums"]["security_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          anomaly_detection_sensitivity?: number
          created_at?: string
          enforce_two_factor?: boolean
          id?: string
          learning_period?: number
          max_failed_attempts?: number
          min_confidence_threshold?: number
          security_level?: Database["public"]["Enums"]["security_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean
          advanced_analytics: boolean
          created_at: string
          custom_security_settings: boolean
          description: string | null
          id: string
          max_biometric_profiles: number
          max_users: number
          name: string
          price_charity: number
          price_company: number
          price_individual: number
          priority_support: boolean
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          advanced_analytics?: boolean
          created_at?: string
          custom_security_settings?: boolean
          description?: string | null
          id?: string
          max_biometric_profiles?: number
          max_users?: number
          name: string
          price_charity?: number
          price_company?: number
          price_individual?: number
          priority_support?: boolean
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          advanced_analytics?: boolean
          created_at?: string
          custom_security_settings?: boolean
          description?: string | null
          id?: string
          max_biometric_profiles?: number
          max_users?: number
          name?: string
          price_charity?: number
          price_company?: number
          price_individual?: number
          priority_support?: boolean
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          end_date: string | null
          id: string
          last_payment: string | null
          payment_method: string | null
          plan_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          last_payment?: string | null
          payment_method?: string | null
          plan_id: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          last_payment?: string | null
          payment_method?: string | null
          plan_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          level: Database["public"]["Enums"]["log_level"]
          message: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      biometric_status: "learning" | "active" | "locked"
      log_level: "info" | "warning" | "error" | "debug"
      security_level: "low" | "medium" | "high" | "very-high"
      subscription_status: "active" | "cancelled" | "expired" | "trial"
      subscription_tier: "free" | "basic" | "professional" | "enterprise"
      user_status: "active" | "locked" | "pending"
      user_type: "individual" | "company" | "charity"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      biometric_status: ["learning", "active", "locked"],
      log_level: ["info", "warning", "error", "debug"],
      security_level: ["low", "medium", "high", "very-high"],
      subscription_status: ["active", "cancelled", "expired", "trial"],
      subscription_tier: ["free", "basic", "professional", "enterprise"],
      user_status: ["active", "locked", "pending"],
      user_type: ["individual", "company", "charity"],
    },
  },
} as const
