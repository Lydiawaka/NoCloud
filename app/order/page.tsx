import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HardDrive } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step 1 of 3</span>
              <span className="text-sm text-muted-foreground">Connect Cloud Storage</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 transition-all" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Connect Your Cloud Storage</h1>
            <p className="text-muted-foreground">Choose your cloud storage provider to get started</p>
          </div>

          {/* Cloud Provider Selection */}
          <div className="space-y-4">
            <Link href="/order/connect?provider=google_drive">
              <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Google Drive</h3>
                    <p className="text-sm text-muted-foreground">Connect your Google Drive account</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </Card>
            </Link>

            <Link href="/order/connect?provider=dropbox">
              <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Dropbox</h3>
                    <p className="text-sm text-muted-foreground">Connect your Dropbox account</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </Card>
            </Link>

            <Link href="/order/connect?provider=onedrive">
              <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.062 10.5c-.063-.563-.563-1.5-1.5-1.5-.938 0-1.5.938-1.5 1.5h3zm8.438 3c0 2.484-2.016 4.5-4.5 4.5h-10.5c-3.313 0-6-2.688-6-6 0-3.094 2.344-5.625 5.344-5.969.656-2.719 3.094-4.781 6.031-4.781 2.719 0 5.063 1.781 5.906 4.25 2.531.188 4.531 2.344 4.531 4.969z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">OneDrive</h3>
                    <p className="text-sm text-muted-foreground">Connect your OneDrive account</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </Card>
            </Link>
          </div>

          {/* Security Note */}
          <Card className="mt-8 p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Secure Connection:</strong> We use OAuth 2.0 for authentication. We
              never see your password and only access files you explicitly select.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}
