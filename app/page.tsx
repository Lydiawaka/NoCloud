import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cloud, CreditCard, Package, Shield, Trash2, HardDrive } from "lucide-react"  
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            Transfer Your Cloud Files to Physical Storage
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Securely move your files from Google Drive, Dropbox, or OneDrive to a flash drive or memory card. Simple,
            private, and delivered to your door.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/order">Start Transfer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">1. Connect Your Cloud</h3>
            <p className="text-muted-foreground">
              Securely connect your Google Drive, Dropbox, or OneDrive account. We only access the files you choose.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">2. Choose & Pay</h3>
            <p className="text-muted-foreground">
              Select your storage type and size, enter your shipping address, and complete your secure payment.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">3. Receive Your Drive</h3>
            <p className="text-muted-foreground">
              We download your files, transfer them to your device, and ship it to you. Track your order anytime.
            </p>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">
                  Your files are encrypted during transfer and we can automatically delete them from your cloud after
                  delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Trash2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Auto-Delete Option</h3>
                <p className="text-muted-foreground text-sm">
                  Choose to automatically delete files from your cloud storage after successful delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <HardDrive className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Quality Storage Devices</h3>
                <p className="text-muted-foreground text-sm">
                  We use reliable, brand-name flash drives and memory cards to ensure your data is safe.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-muted-foreground text-sm">
                  Track your order in real-time from download to delivery. Most orders ship within 2-3 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Free Up Your Cloud?</h2>
          <p className="text-lg text-muted-foreground">
            Start your transfer today and get your files on physical storage in just a few days.
          </p>
          <Button asChild size="lg">
            <Link href="/order">Get Started Now</Link>
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
