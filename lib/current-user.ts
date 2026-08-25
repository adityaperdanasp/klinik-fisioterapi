import { createClient } from "@/lib/supabase/server";

export type CurrentProfile = {
  id: string;
  full_name: string;
  role: "admin" | "fisioterapis" | "resepsionis";
};

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  return data as CurrentProfile | null;
}
