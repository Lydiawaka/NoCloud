import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"


function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}
// clientId, clientSecret in the environment variables
const OAUTH_CONFIG = {
  google_drive: {
    clientId: getEnvVar("GOOGLE_CLIENT_ID"),
    clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    extraParams: { access_type: "offline", prompt: "consent" },
  },
  dropbox: {
    clientId: getEnvVar("DROPBOX_CLIENT_ID"),
    clientSecret: getEnvVar("DROPBOX_CLIENT_SECRET"),
    authUrl: "https://www.dropbox.com/oauth2/authorize",
    scopes: ["files.metadata.read", "files.content.read"],
    extraParams: {},
  },
  onedrive: {
    clientId: getEnvVar("ONEDRIVE_CLIENT_ID"),
    clientSecret: getEnvVar("ONEDRIVE_CLIENT_SECRET"),
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scopes: ["Files.Read", "Files.Read.All"],
    extraParams: {},
  },
} as const

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json()

    if (!provider || !(provider in OAUTH_CONFIG)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
    }

    const config = OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG]

    
    const state = crypto.randomUUID()

    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000"
    const redirectUri = `${baseUrl}/api/oauth/callback`

    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: config.scopes.join(" "),
      state: `${provider}:${state}`,
      ...config.extraParams,
    })

    const authUrl = `${config.authUrl}?${params.toString()}`

   
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("OAuth initiation error:", error)
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 }
    )
  }
}
