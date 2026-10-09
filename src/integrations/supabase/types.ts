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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          attention_title: string
          banner_primary_path: string
          banner_secondary_path: string
          checkout_description: string
          company_document: string
          company_name: string
          created_at: string
          federal_fee_cents: number
          footer_contact_text: string
          footer_contact_title: string
          footer_copyright: string
          footer_policy_one_label: string
          footer_policy_one_url: string
          footer_policy_two_label: string
          footer_policy_two_url: string
          header_logo_path: string
          icms_fee_cents: number
          id: boolean
          packaging_offer: Json
          processing_fee_cents: number
          support_email: string
          support_phone: string
          updated_at: string
          upsell_banner_path: string
          upsell_eyebrow: string
          upsell_intro_description: string
          upsell_intro_icon_path: string
          upsell_intro_label: string
          upsell_intro_price_cents: number | null
          upsell_intro_subtitle: string
          upsell_intro_title: string
          upsell_price_cents: number | null
          upsell_service_description: string
          upsell_service_icon_path: string
          upsell_service_label: string
          upsell_service_name: string
          upsell_service_subtitle: string
          upsell_title: string
          warning_banner_text: string
        }
        Insert: {
          attention_title?: string
          banner_primary_path?: string
          banner_secondary_path?: string
          checkout_description?: string
          company_document?: string
          company_name?: string
          created_at?: string
          federal_fee_cents?: number
          footer_contact_text?: string
          footer_contact_title?: string
          footer_copyright?: string
          footer_policy_one_label?: string
          footer_policy_one_url?: string
          footer_policy_two_label?: string
          footer_policy_two_url?: string
          header_logo_path?: string
          icms_fee_cents?: number
          id?: boolean
          packaging_offer?: Json
          processing_fee_cents?: number
          support_email?: string
          support_phone?: string
          updated_at?: string
          upsell_banner_path?: string
          upsell_eyebrow?: string
          upsell_intro_description?: string
          upsell_intro_icon_path?: string
          upsell_intro_label?: string
          upsell_intro_price_cents?: number | null
          upsell_intro_subtitle?: string
          upsell_intro_title?: string
          upsell_price_cents?: number | null
          upsell_service_description?: string
          upsell_service_icon_path?: string
          upsell_service_label?: string
          upsell_service_name?: string
          upsell_service_subtitle?: string
          upsell_title?: string
          warning_banner_text?: string
        }
        Update: {
          attention_title?: string
          banner_primary_path?: string
          banner_secondary_path?: string
          checkout_description?: string
          company_document?: string
          company_name?: string
          created_at?: string
          federal_fee_cents?: number
          footer_contact_text?: string
          footer_contact_title?: string
          footer_copyright?: string
          footer_policy_one_label?: string
          footer_policy_one_url?: string
          footer_policy_two_label?: string
          footer_policy_two_url?: string
          header_logo_path?: string
          icms_fee_cents?: number
          id?: boolean
          packaging_offer?: Json
          processing_fee_cents?: number
          support_email?: string
          support_phone?: string
          updated_at?: string
          upsell_banner_path?: string
          upsell_eyebrow?: string
          upsell_intro_description?: string
          upsell_intro_icon_path?: string
          upsell_intro_label?: string
          upsell_intro_price_cents?: number | null
          upsell_intro_subtitle?: string
          upsell_intro_title?: string
          upsell_price_cents?: number | null
          upsell_service_description?: string
          upsell_service_icon_path?: string
          upsell_service_label?: string
          upsell_service_name?: string
          upsell_service_subtitle?: string
          upsell_title?: string
          warning_banner_text?: string
        }
        Relationships: []
      }
      payment_orders: {
        Row: {
          amount_in_cents: number
          created_at: string
          customer_document: string | null
          customer_email: string
          customer_ip: string | null
          customer_name: string
          gateway_status: string
          id: string
          last_checked_at: string | null
          last_error: string | null
          tracking_parameters: Json
          txid: string
          updated_at: string
          utmify_paid_claimed_at: string | null
          utmify_paid_sent_at: string | null
          utmify_pending_sent_at: string | null
        }
        Insert: {
          amount_in_cents: number
          created_at?: string
          customer_document?: string | null
          customer_email: string
          customer_ip?: string | null
          customer_name: string
          gateway_status?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          tracking_parameters?: Json
          txid: string
          updated_at?: string
          utmify_paid_claimed_at?: string | null
          utmify_paid_sent_at?: string | null
          utmify_pending_sent_at?: string | null
        }
        Update: {
          amount_in_cents?: number
          created_at?: string
          customer_document?: string | null
          customer_email?: string
          customer_ip?: string | null
          customer_name?: string
          gateway_status?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          tracking_parameters?: Json
          txid?: string
          updated_at?: string
          utmify_paid_claimed_at?: string | null
          utmify_paid_sent_at?: string | null
          utmify_pending_sent_at?: string | null
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
      claim_payment_order_for_utmify: {
        Args: { _txid: string }
        Returns: {
          amount_in_cents: number
          created_at: string
          customer_document: string | null
          customer_email: string
          customer_ip: string | null
          customer_name: string
          gateway_status: string
          id: string
          last_checked_at: string | null
          last_error: string | null
          tracking_parameters: Json
          txid: string
          updated_at: string
          utmify_paid_claimed_at: string | null
          utmify_paid_sent_at: string | null
          utmify_pending_sent_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "payment_orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      configure_payment_reconciliation: {
        Args: { _url: string }
        Returns: string
      }
      get_optional_offer_content: { Args: never; Returns: Json }
      verify_reconciliation_token: {
        Args: { _token: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
