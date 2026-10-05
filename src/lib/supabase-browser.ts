import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let cached: SupabaseClient | null = null;

// Trả null khi chưa cấu hình env để app hiển thị màn hình hướng dẫn thay vì crash.
export function getSupabase(): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;
  if (!cached) {
    cached = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return cached;
}

// Chỉ gọi trong các module chắc chắn chạy sau khi app đã được cấu hình.
export function requireSupabase(): SupabaseClient {
  const client = getSupabase();
  if (!client) throw new Error("Supabase chưa được cấu hình (thiếu biến môi trường).");
  return client;
}
