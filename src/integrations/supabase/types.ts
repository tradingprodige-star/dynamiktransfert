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
      points_history: {
        Row: {
          created_at: string
          id: string
          points: number
          reason: string
          referral_click_id: string | null
          sponsor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points: number
          reason: string
          referral_click_id?: string | null
          sponsor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          reason?: string
          referral_click_id?: string | null
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_referral_click_id_fkey"
            columns: ["referral_click_id"]
            isOneToOne: false
            referencedRelation: "referral_clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_usage: {
        Row: {
          id: string
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          ambassador_name: string | null
          code: string
          created_at: string
          current_uses: number
          discount_percentage: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          type: string
          updated_at: string
        }
        Insert: {
          ambassador_name?: string | null
          code: string
          created_at?: string
          current_uses?: number
          discount_percentage: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          ambassador_name?: string | null
          code?: string
          created_at?: string
          current_uses?: number
          discount_percentage?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          country_from: string | null
          country_to: string | null
          created_at: string
          godchild_id: string
          godchild_phone: string | null
          id: string
          ip_address: string | null
          points_awarded: number | null
          referral_code: string
          source: string | null
          sponsor_id: string
          transfer_amount: number | null
          transfer_status: string
          updated_at: string
          user_agent: string | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          country_from?: string | null
          country_to?: string | null
          created_at?: string
          godchild_id: string
          godchild_phone?: string | null
          id?: string
          ip_address?: string | null
          points_awarded?: number | null
          referral_code: string
          source?: string | null
          sponsor_id: string
          transfer_amount?: number | null
          transfer_status?: string
          updated_at?: string
          user_agent?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          country_from?: string | null
          country_to?: string | null
          created_at?: string
          godchild_id?: string
          godchild_phone?: string | null
          id?: string
          ip_address?: string | null
          points_awarded?: number | null
          referral_code?: string
          source?: string | null
          sponsor_id?: string
          transfer_amount?: number | null
          transfer_status?: string
          updated_at?: string
          user_agent?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_claims: {
        Row: {
          created_at: string
          id: string
          points_spent: number
          processed_at: string | null
          processed_by: string | null
          reward_id: string
          sponsor_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_spent: number
          processed_at?: string | null
          processed_by?: string | null
          reward_id: string
          sponsor_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          points_spent?: number
          processed_at?: string | null
          processed_by?: string | null
          reward_id?: string
          sponsor_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_claims_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_claims_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          points_required: number
          reward_type: string
          reward_value: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          points_required: number
          reward_type: string
          reward_value?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          points_required?: number
          reward_type?: string
          reward_value?: number | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          cumulative_volume: number | null
          current_level: string | null
          id: string
          is_active: boolean
          is_blocked: boolean
          is_vip_godchild: boolean | null
          monthly_volume: number | null
          monthly_volume_reset_at: string | null
          phone_number: string
          referral_code: string
          total_points: number
          total_referrals: number
          total_validated: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cumulative_volume?: number | null
          current_level?: string | null
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          is_vip_godchild?: boolean | null
          monthly_volume?: number | null
          monthly_volume_reset_at?: string | null
          phone_number: string
          referral_code: string
          total_points?: number
          total_referrals?: number
          total_validated?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cumulative_volume?: number | null
          current_level?: string | null
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          is_vip_godchild?: boolean | null
          monthly_volume?: number | null
          monthly_volume_reset_at?: string | null
          phone_number?: string
          referral_code?: string
          total_points?: number
          total_referrals?: number
          total_validated?: number
          updated_at?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      users: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_points_for_amount: {
        Args: { _amount: number }
        Returns: number
      }
      calculate_sponsor_level: {
        Args: { _monthly_volume: number }
        Returns: string
      }
      check_and_award_milestone_bonus: {
        Args: {
          _new_cumulative: number
          _old_cumulative: number
          _sponsor_id: string
        }
        Returns: number
      }
      generate_referral_code: { Args: never; Returns: string }
      get_level_bonus_percentage: {
        Args: { _monthly_volume: number }
        Returns: number
      }
      get_referral_multiplier: {
        Args: { _is_vip_godchild: boolean }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_transfer:
        | {
            Args: {
              _admin_id: string
              _click_id: string
              _transfer_amount: number
            }
            Returns: boolean
          }
        | {
            Args: {
              _admin_id: string
              _click_id: string
              _transfer_amount: number
            }
            Returns: boolean
          }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
