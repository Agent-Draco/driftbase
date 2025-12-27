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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      hall_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          custom_badge_color: string | null
          description: string | null
          folder_id: string
          icon: string | null
          id: string
          member_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          custom_badge_color?: string | null
          description?: string | null
          folder_id: string
          icon?: string | null
          id?: string
          member_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          custom_badge_color?: string | null
          description?: string | null
          folder_id?: string
          icon?: string | null
          id?: string
          member_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "hall_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_entries_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "hall_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_entries_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_folders: {
        Row: {
          created_at: string | null
          folder_type: string
          id: string
          sleepover_id: string | null
          title: string
          year_id: string
        }
        Insert: {
          created_at?: string | null
          folder_type: string
          id?: string
          sleepover_id?: string | null
          title: string
          year_id: string
        }
        Update: {
          created_at?: string | null
          folder_type?: string
          id?: string
          sleepover_id?: string | null
          title?: string
          year_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hall_folders_sleepover_id_fkey"
            columns: ["sleepover_id"]
            isOneToOne: false
            referencedRelation: "sleepovers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_folders_year_id_fkey"
            columns: ["year_id"]
            isOneToOne: false
            referencedRelation: "hall_years"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_years: {
        Row: {
          created_at: string | null
          id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          year?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_forms: {
        Row: {
          allergies: string | null
          created_at: string | null
          custom_fields: Json | null
          digital_signature: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          medical_notes: string | null
          medications: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          signed_at: string | null
          sleepover_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          allergies?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          digital_signature?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          medical_notes?: string | null
          medications?: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          signed_at?: string | null
          sleepover_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          allergies?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          digital_signature?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          medical_notes?: string | null
          medications?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          signed_at?: string | null
          sleepover_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_forms_sleepover_id_fkey"
            columns: ["sleepover_id"]
            isOneToOne: false
            referencedRelation: "sleepovers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          created_at: string | null
          created_by: string | null
          icon: string | null
          id: string
          steps: Json
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          icon?: string | null
          id?: string
          steps?: Json
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          icon?: string | null
          id?: string
          steps?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "processes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string
          id: string
          is_online: boolean | null
          last_seen: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          id: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sleepover_logs: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          highlights: string[] | null
          id: string
          sleepover_id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          highlights?: string[] | null
          id?: string
          sleepover_id: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          highlights?: string[] | null
          id?: string
          sleepover_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sleepover_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sleepover_logs_sleepover_id_fkey"
            columns: ["sleepover_id"]
            isOneToOne: false
            referencedRelation: "sleepovers"
            referencedColumns: ["id"]
          },
        ]
      }
      sleepovers: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          location: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sleepovers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      traditions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "traditions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_participants: {
        Row: {
          id: string
          is_muted: boolean | null
          joined_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "voice_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_rooms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
