// Check if all required environment variables are set
console.log("🔍 Checking Supabase Environment Variables...\n")

const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

let allSet = true

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar]
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${envVar}: NOT SET`)
    allSet = false
  }
})

console.log("\n" + "=".repeat(50))

if (allSet) {
  console.log("🎉 All environment variables are set!")
  console.log("🍹 Your Supabase integration is ready!")
} else {
  console.log("⚠️  Missing environment variables detected!")
  console.log("\n📋 To fix this:")
  console.log("1. Go to your Supabase project dashboard")
  console.log("2. Navigate to Settings > API")
  console.log("3. Copy the Project URL and anon public key")
  console.log("4. Add them to your project environment variables")
  console.log("\n🔧 Required variables:")
  console.log("- NEXT_PUBLIC_SUPABASE_URL=your_project_url")
  console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key")
  console.log("- SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
}

console.log("\n🔗 Supabase Dashboard: https://supabase.com/dashboard")
