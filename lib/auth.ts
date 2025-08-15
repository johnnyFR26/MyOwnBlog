import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export async function signUp(email: string, name: string, password: string) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return { error: "User already exists with this email" }
    }

    // Create new user
    const { data, error } = await supabase.from("users").insert([{ email, name, password }]).select().single()

    if (error) {
      return { error: error.message }
    }

    return { user: data }
  } catch (error) {
    return { error: "Failed to create user" }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, created_at")
      .eq("email", email)
      .eq("password", password)
      .single()

    if (error || !data) {
      return { error: "Invalid email or password" }
    }

    return { user: data }
  } catch (error) {
    return { error: "Failed to sign in" }
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase.from("users").select("id, email, name, created_at").eq("id", id).single()

    if (error || !data) {
      return { error: "User not found" }
    }

    return { user: data }
  } catch (error) {
    return { error: "Failed to get user" }
  }
}
