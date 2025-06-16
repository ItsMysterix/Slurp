import { createClient } from "@supabase/supabase-js"

// Replace with your Supabase URL and service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  const email = "test@example.com"
  const password = "password123"

  try {
    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      throw error
    }

    console.log("Test user created successfully:", data.user)
    console.log("Email:", email)
    console.log("Password:", password)
  } catch (error) {
    console.error("Error creating test user:", error)
  }
}

createTestUser()
