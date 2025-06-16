// Detailed environment variable checker
console.log("🔍 Detailed Supabase Environment Check...\n")

const requiredEnvVars = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Your Supabase project URL",
    required: true,
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Your Supabase anonymous/public key",
    required: true,
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    description: "Your Supabase service role key (for admin operations)",
    required: false,
  },
]

let criticalMissing = false
let optionalMissing = false

console.log("📋 Environment Variable Status:")
console.log("=" * 50)

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar.name]
  const status = value ? "✅ SET" : "❌ MISSING"
  const preview = value ? `${value.substring(0, 30)}...` : "Not found"

  console.log(`${status} ${envVar.name}`)
  console.log(`   Description: ${envVar.description}`)
  console.log(`   Value: ${preview}`)
  console.log(`   Required: ${envVar.required ? "Yes" : "No (optional)"}`)
  console.log("")

  if (!value && envVar.required) {
    criticalMissing = true
  } else if (!value && !envVar.required) {
    optionalMissing = true
  }
})

console.log("=" * 50)
console.log("📊 Summary:")

if (!criticalMissing && !optionalMissing) {
  console.log("🎉 All environment variables are properly configured!")
  console.log("🍹 Your Supabase integration is fully ready!")
} else if (!criticalMissing && optionalMissing) {
  console.log("✅ Critical variables are set - app will work!")
  console.log("⚠️  Optional variables missing - some features may be limited")
  console.log("💡 Service role key enables admin operations like profile creation")
} else {
  console.log("❌ Critical environment variables are missing!")
  console.log("🚫 App may not function properly")
}

console.log("\n🔧 Setup Instructions:")
console.log("1. Go to https://supabase.com/dashboard")
console.log("2. Select your project")
console.log("3. Go to Settings > API")
console.log("4. Copy the values and add them to your environment")

if (criticalMissing) {
  console.log("\n🚨 Required Actions:")
  console.log("- Add NEXT_PUBLIC_SUPABASE_URL")
  console.log("- Add NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

if (optionalMissing) {
  console.log("\n💡 Optional Improvements:")
  console.log("- Add SUPABASE_SERVICE_ROLE_KEY for better profile creation")
}
