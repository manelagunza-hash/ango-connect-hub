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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_ids: string[]
          service_request_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_ids: string[]
          service_request_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_ids?: string[]
          service_request_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          is_admin_message: boolean | null
          message_type: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_admin_message?: boolean | null
          message_type?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_admin_message?: boolean | null
          message_type?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          payment_date: string | null
          payment_method: string
          professional_id: string
          proposal_id: string | null
          service_request_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          professional_id: string
          proposal_id?: string | null
          service_request_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          professional_id?: string
          proposal_id?: string | null
          service_request_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_certifications: {
        Row: {
          certificate_url: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          issue_date: string | null
          issuer: string | null
          professional_id: string
          title: string
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          issue_date?: string | null
          issuer?: string | null
          professional_id: string
          title: string
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          issue_date?: string | null
          issuer?: string | null
          professional_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_certifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_portfolio: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          professional_id: string
          project_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          professional_id: string
          project_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          professional_id?: string
          project_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_portfolio_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          base_price: number | null
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          is_active: boolean | null
          professional_id: string
          service_name: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          professional_id: string
          service_name: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          professional_id?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          availability_schedule: Json | null
          created_at: string
          description: string | null
          email: string
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          is_verified: boolean | null
          location: string | null
          name: string
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          payment_methods: Json | null
          phone: string | null
          privacy_settings: Json | null
          profession: string
          rating: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          created_at?: string
          description?: string | null
          email: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          name: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          payment_methods?: Json | null
          phone?: string | null
          privacy_settings?: Json | null
          profession: string
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          created_at?: string
          description?: string | null
          email?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          name?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          payment_methods?: Json | null
          phone?: string | null
          privacy_settings?: Json | null
          profession?: string
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          client_id: string
          created_at: string
          estimated_duration: number | null
          id: string
          message: string | null
          price: number
          professional_id: string
          service_request_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          estimated_duration?: number | null
          id?: string
          message?: string | null
          price: number
          professional_id: string
          service_request_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          estimated_duration?: number | null
          id?: string
          message?: string | null
          price?: number
          professional_id?: string
          service_request_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string | null
          comment: string | null
          created_at: string
          id: string
          professional_id: string | null
          rating: number
          service_request_id: string | null
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          professional_id?: string | null
          rating: number
          service_request_id?: string | null
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          professional_id?: string | null
          rating?: number
          service_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          budget: number | null
          client_id: string | null
          completed_at: string | null
          created_at: string
          description: string
          id: string
          location: string
          professional_id: string | null
          scheduled_date: string | null
          status: string | null
          title: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          location: string
          professional_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string
          professional_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          active: boolean
          created_at: string
          end_date: string | null
          id: string
          plan: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          plan: string
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          plan?: string
          start_date?: string
          updated_at?: string
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
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "client" | "professional"
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
      user_role: ["admin", "client", "professional"],
    },
  },
} as const
