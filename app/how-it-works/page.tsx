import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HardDrive, Download, HardDriveDownload, CheckCircle, Shield, Lock, Trash2 } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Not Cloud Storage</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/how-it-works" className="text-sm font-medium text-foreground">
              How It Works
            </Link>
            <Link href="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Track Order
            </Link>
            <Button asChild size="sm">
              <Link href="/order">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple, secure process to transfer your cloud files to physical storage
        </p>
      </section>

      {/* Detailed Steps */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Step 1 */}
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">Connect Your Cloud Storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                Start by securely connecting your cloud storage account. We support Google Drive, Dropbox, and OneDrive.
                You'll be redirected to your provider's official login page to authorize access.
              </p>
              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Secure OAuth Authentication</p>
                    <p className="text-muted-foreground">
                      We use industry-standard OAuth 2.0. We never see your password and only access files you
                      explicitly select.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">Select Files & Storage Type</h2>
              <p className="text-muted-foreground leading-relaxed">
                Browse your cloud storage and select the files or folders you want to transfer. We'll calculate the
                total size and recommend the appropriate storage device.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Flash Drives</h3>
                  <p className="text-sm text-muted-foreground mb-2">USB 3.0, high-speed transfer</p>
                  <p className="text-xs text-muted-foreground">Available: 32GB, 64GB, 128GB, 256GB</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Memory Cards</h3>
                  <p className="text-sm text-muted-foreground mb-2">SD cards for cameras & devices</p>
                  <p className="text-xs text-muted-foreground">Available: 32GB, 64GB, 128GB, 256GB</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">Enter Shipping & Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Provide your shipping address and complete payment securely through Stripe. You'll receive an order
                confirmation with a tracking number.
              </p>
              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Secure Payment Processing</p>
                    <p className="text-muted-foreground">
                      All payments are processed through Stripe. We never store your credit card information.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                4
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">We Process Your Order</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once payment is confirmed, we begin downloading your files from your cloud storage. You can track the
                progress in real-time through your order tracking page.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Download className="h-4 w-4 text-primary" />
                  <span>Files are downloaded securely to our system</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <HardDriveDownload className="h-4 w-4 text-primary" />
                  <span>Files are transferred to your storage device</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Device is verified and packaged</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                5
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">Receive Your Storage Device</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your storage device is shipped via tracked delivery. Most orders ship within 2-3 business days. You'll
                receive shipping updates via email.
              </p>
              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <Trash2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Optional: Auto-Delete Cloud Files</p>
                    <p className="text-muted-foreground">
                      Choose to automatically delete your files from cloud storage after successful delivery. This helps
                      you reclaim cloud storage space and maintain privacy.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="bg-muted/50 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Privacy & Security</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Your Data is Protected</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• End-to-end encryption during transfer</li>
                  <li>• Files are deleted from our servers after transfer</li>
                  <li>• No permanent storage of your data</li>
                  <li>• Secure OAuth authentication</li>
                </ul>
              </Card>

              <Card className="p-6">
                <Lock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Limited Access</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• We only access files you explicitly select</li>
                  <li>• OAuth tokens are encrypted and stored securely</li>
                  <li>• You can revoke access anytime</li>
                  <li>• No access to your cloud account password</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground">
            Transfer your cloud files to physical storage in just a few clicks
          </p>
          <Button asChild size="lg">
            <Link href="/order">Start Your Transfer</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Not Cloud Storage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
