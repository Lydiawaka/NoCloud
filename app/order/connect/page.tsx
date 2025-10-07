"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HardDrive, Loader2, AlertCircle } from "lucide-react"

function ConnectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const provider = searchParams.get("provider")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const providerNames: Record<string, string> = {
    google_drive: "Google Drive",
    dropbox: "Dropbox",
    onedrive: "OneDrive",
  }

  const handleConnect = async () => {
    if (!provider) return

    setIsConnecting(true)
    setError(null)

    try {
      // Call API to initiate OAuth flow
      const response = await fetch("/api/oauth/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate connection")
      }

      // Redirect to OAuth provider
      window.location.href = data.authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsConnecting(false)
    }
  }

  if (!provider || !providerNames[provider]) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Invalid Provider</h2>
        <p className="text-muted-foreground mb-4">Please select a valid cloud storage provider.</p>
        <Button asChild>
          <Link href="/order">Go Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Connect to {providerNames[provider]}</h1>
        <p className="text-muted-foreground">You'll be redirected to {providerNames[provider]} to authorize access</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">What we'll access:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• View your files and folders</li>
              <li>• Download files you select</li>
              <li>• Read file metadata (names, sizes, types)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">What we won't do:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Access your password</li>
              <li>• Modify or delete files (unless you choose auto-delete)</li>
              <li>• Share your files with anyone</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button onClick={handleConnect} disabled={isConnecting} className="w-full" size="lg">
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              `Connect to ${providerNames[provider]}`
            )}
          </Button>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/order">Cancel</Link>
          </Button>
        </div>
      </Card>

      <p className="text-xs text-center text-muted-foreground mt-4">
        By connecting, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}

export default function ConnectPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Not Cloud Storage</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          }
        >
          <ConnectContent />
        </Suspense>
      </main>
    </div>
  )
}
