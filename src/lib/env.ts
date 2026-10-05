// Trim + bỏ trailing slash và /rest/v1: lỗi copy-paste phổ biến nhất khiến Supabase trả "Invalid path".
function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, "");
}

export const env = {
  supabaseUrl: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
};

export const supabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
