export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      gifts: {
        Row: {
          id: string;
          name: string;
          price: number;
          image: string;
          category: string;
          available: boolean;
          description: string;
          purchase_link: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          image: string;
          category: string;
          available?: boolean;
          description?: string;
          purchase_link?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          image?: string;
          category?: string;
          available?: boolean;
          description?: string;
          purchase_link?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          phone: string;
          delivery_method: string;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          phone: string;
          delivery_method: string;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          phone?: string;
          delivery_method?: string;
          total?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          gift_id: string;
          gift_name: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          gift_id: string;
          gift_name: string;
          price: number;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          gift_id?: string;
          gift_name?: string;
          price?: number;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_gift_id_fkey';
            columns: ['gift_id'];
            referencedRelation: 'gifts';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type GiftRow = Database['public']['Tables']['gifts']['Row'];
export type GiftInsert = Database['public']['Tables']['gifts']['Insert'];
export type GiftUpdate = Database['public']['Tables']['gifts']['Update'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
