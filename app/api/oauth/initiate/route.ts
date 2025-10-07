import { type NextRequest, NextResponse } from "next/server"

// OAuth configuration
// NOTE: These would need to be set up in environment variables
const OAUTH_CONFIG = {
  google_drive: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  },
  dropbox: {
    clientId: process.env.DROPBOX_CLIENT_ID || "",
    clientSecret: process.env.DROPBOX_CLIENT_SECRET || "",
    authUrl: "https://www.dropbox.com/oauth2/authorize",
    scopes: ["files.metadata.read", "files.content.read"],
  },
  onedrive: {
    clientId: process.env.ONEDRIVE_CLIENT_ID || "",
    clientSecret: process.env.ONEDRIVE_CLIENT_SECRET || "",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scopes: ["Files.Read", "Files.Read.All"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json()

    if (!provider || !OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG]) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
    }

    const config = OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG]

    // Generate a random state for CSRF protection
    const state = crypto.randomUUID()

    // Build the OAuth URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/oauth/callback`

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: config.scopes.join(" "),
      state: `${provider}:${state}`,
      access_type: "offline", // For Google Drive to get refresh token
      prompt: "consent", // Force consent screen to get refresh token
    })

    const authUrl = `${config.authUrl}?${params.toString()}`

    // In a real implementation, you would store the state in a session or database
    // to verify it in the callback

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error(" OAuth initiation error:", error)
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 })
  }
}
