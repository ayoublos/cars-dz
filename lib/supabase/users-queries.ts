import { createSupabaseServerClient } from "./server";
import { rowToUser } from "@/lib/util/mapper";

export type User = {
    id: string;
    email: string;
    password: string;
    role: string;
  };

export async function fetchUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToUser(data as User);
};