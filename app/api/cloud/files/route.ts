import { type NextRequest, NextResponse } from "next/server"
import { getOAuthSession } from "@/lib/db"
import { fetchGoogleDriveFiles } from "@/lib/providers/google"
import { fetchDropboxFiles } from "@/lib/providers/dropbox"
import { fetchOneDriveFiles } from "@/lib/providers/onedrive"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("session")
    const path = searchParams.get("path") || "/"

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // 1️⃣ Retrieve OAuth tokens and provider info from your database
    const session = await getOAuthSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // 2️⃣ Call provider-specific API
    let files: any[] = []
    switch (session.provider) {
      case "google":
        files = await fetchGoogleDriveFiles(session.accessToken, path)
        break
      case "dropbox":
        files = await fetchDropboxFiles(session.accessToken, path)
        break
      case "onedrive":
        files = await fetchOneDriveFiles(session.accessToken, path)
        break
      default:
        return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
    }

    // 3️⃣ Normalize and respond
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Cloud files API error:", error)
    return NextResponse.json({ error: "Failed to load files" }, { status: 500 })
  }
}
