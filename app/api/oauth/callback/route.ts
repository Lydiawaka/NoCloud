import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      // User denied access or error occurred
      return NextResponse.redirect(new URL(`/order?error=${error}`, request.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/order?error=invalid_callback", request.url))
    }

    // Extract provider from state
    const [provider] = state.split(":")

    // Exchange code for access token
    // NOTE: This would need to be implemented based on the provider
    // For now, we'll create a session and redirect to file selection

    // In a real implementation:
    // 1. Exchange the authorization code for an access token
    // 2. Store the access token and refresh token securely (encrypted in database)
    // 3. Create a session for the user
    // 4. Redirect to file selection page

    const sessionId = crypto.randomUUID()

    // TODO: Store session with OAuth tokens in database

    return NextResponse.redirect(new URL(`/order/select-files?session=${sessionId}`, request.url))
  } catch (error) {
    console.error(" OAuth callback error:", error)
    return NextResponse.redirect(new URL("/order?error=callback_failed", request.url))
  }
}
