// Create test user and sample data for development
import { createClient } from "@supabase/supabase-js"

async function seedTestData() {
  console.log("🌱 Seeding test data for Slurp...\n")

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    // Create a test user (this would normally be done through auth signup)
    console.log("👤 Creating test user profile...")

    const testUserId = "00000000-0000-0000-0000-000000000001" // Fake UUID for testing

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: testUserId,
        username: "testuser",
        name: "Test User",
        profile_icon: "strawberry-bliss",
        anonymous_mode: false,
      })
      .select()

    if (profileError) {
      console.error("❌ Failed to create test profile:", profileError.message)
      return
    }

    console.log("✅ Test profile created")

    // Create sample mood entries
    console.log("😊 Creating sample mood entries...")

    const sampleMoods = [
      {
        user_id: testUserId,
        mood_name: "Strawberry Bliss",
        emoji: "/mood-icons/strawberry-bliss.ico",
        emotion: "Happy",
        note: "Had a great day at work!",
        bg_color: "bg-pink-100",
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      {
        user_id: testUserId,
        mood_name: "Peachy Keen",
        emoji: "/mood-icons/peachy-keen.ico",
        emotion: "Content",
        note: "Feeling peaceful and satisfied",
        bg_color: "bg-orange-100",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        user_id: testUserId,
        mood_name: "Blueberry Burnout",
        emoji: "/mood-icons/blueberry-burnout.ico",
        emotion: "Exhausted",
        note: "Long week, need some rest",
        bg_color: "bg-blue-100",
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      },
    ]

    const { data: moods, error: moodError } = await supabase.from("mood_entries").insert(sampleMoods).select()

    if (moodError) {
      console.error("❌ Failed to create sample moods:", moodError.message)
      return
    }

    console.log(`✅ Created ${moods.length} sample mood entries`)

    // Create a weekly goal
    console.log("🎯 Creating sample weekly goal...")

    const { data: goal, error: goalError } = await supabase
      .from("weekly_goals")
      .insert({
        user_id: testUserId,
        mood_id: "strawberry-bliss",
        mood_name: "Strawberry Bliss",
        target_count: 3,
      })
      .select()

    if (goalError) {
      console.error("❌ Failed to create weekly goal:", goalError.message)
    } else {
      console.log("✅ Sample weekly goal created")
    }

    console.log("\n🎉 Test data seeded successfully!")
    console.log("💡 You can now test the app with sample data")
  } catch (error) {
    console.error("❌ Error seeding test data:", error)
  }
}

// Run the seeding
seedTestData().catch(console.error)
