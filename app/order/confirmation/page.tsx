"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HardDrive, CheckCircle, Loader2, AlertCircle } from "lucide-react"

interface Order {
  orderNumber: string
  customerEmail: string
  storageType: string
  storageSize: number
  status: string
  createdAt: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderNumber) {
      setError("Invalid order number")
      setIsLoading(false)
      return
    }

    loadOrder()
  }, [orderNumber])

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load order")
      }

      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">{error || "Unable to load order details"}</p>
        <Button asChild>
          <Link href="/order">Start New Order</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your order. We will start processing it right away.</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-2xl font-bold">{order.orderNumber}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage Device</span>
                <span>
                  {order.storageSize}GB {order.storageType === "flash_drive" ? "Flash Drive" : "Memory Card"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize">{order.status.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{order.customerEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6 bg-muted/50">
        <h3 className="font-semibold mb-2">What happens next?</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. We'll download your selected files from your cloud storage</li>
          <li>2. Files will be transferred to your storage device</li>
          <li>3. Your device will be packaged and shipped to you</li>
          <li>4. You'll receive tracking information via email</li>
        </ol>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href={`/track?order=${order.orderNumber}`}>Track Your Order</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 bg-transparent">
          <Link href="/">Return Home</Link>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        A confirmation email has been sent to <strong>{order.customerEmail}</strong>
      </p>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
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
          <ConfirmationContent />
        </Suspense>
      </main>
    </div>
  )
}
