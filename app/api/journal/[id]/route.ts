import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the journal entry
    const { error: deleteError } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id) // Ensure user can only delete their own entries

    if (deleteError) {
      console.error("Error deleting journal entry:", deleteError)
      return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Entry deleted successfully",
    })
  } catch (error) {
    console.error("Error in journal DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
