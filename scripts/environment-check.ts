// Comprehensive environment and database connection check
import { createClient } from "@supabase/supabase-js"

async function checkEnvironment() {
  console.log("🔍 Checking Slurp Environment Configuration...\n")

  // Check required environment variables
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GROQ_API_KEY",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:")
    missingVars.forEach((varName) => console.error(`   - ${varName}`))
    console.log("\n💡 Make sure to set these in your environment or .env file\n")
    return false
  }

  console.log("✅ All required environment variables are set\n")

  // Test Supabase connection
  console.log("🔗 Testing Supabase connection...")

  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Test basic connection
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      console.error("❌ Supabase connection failed:", error.message)
      return false
    }

    console.log("✅ Supabase connection successful")

    // Test admin connection
    const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: adminData, error: adminError } = await adminClient.from("profiles").select("count").limit(1)

    if (adminError) {
      console.warn("⚠️  Admin client connection failed:", adminError.message)
      console.log("   This might affect some features but the app should still work")
    } else {
      console.log("✅ Admin client connection successful")
    }
  } catch (error) {
    console.error("❌ Database connection error:", error)
    return false
  }

  // Test Groq API
  console.log("\n🤖 Testing Groq API connection...")

  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("❌ Groq API connection failed:", response.statusText)
      return false
    }

    console.log("✅ Groq API connection successful")
  } catch (error) {
    console.error("❌ Groq API connection error:", error)
    return false
  }

  console.log("\n🎉 All systems check passed! Slurp is ready to go! 🍓")
  return true
}

// Run the check
checkEnvironment().catch(console.error)
