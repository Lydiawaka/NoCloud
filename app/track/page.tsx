"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  HardDrive,
  Loader2,
  Search,
  CheckCircle,
  Clock,
  Download,
  Package,
  Truck,
  Home,
  AlertCircle,
} from "lucide-react"

interface OrderEvent {
  id: string
  type: string
  title: string
  description: string
  createdAt: string
  completed: boolean
}

interface Order {
  orderNumber: string
  customerEmail: string
  storageType: string
  storageSize: number
  status: string
  createdAt: string
  trackingNumber?: string
  carrier?: string
  events: OrderEvent[]
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const orderParam = searchParams.get("order")

  const [orderNumber, setOrderNumber] = useState(orderParam || "")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

    setIsLoading(true)
    setError(null)
    setOrder(null)

    try {
      const response = await fetch(`/api/orders/${orderNumber}/tracking`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Order not found")
      }

      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    switch (status) {
      case "pending_payment":
      case "payment_received":
        return <Clock className="h-5 w-5 text-muted-foreground" />
      case "files_downloading":
      case "files_downloaded":
        return <Download className="h-5 w-5 text-blue-500" />
      case "device_prepared":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <Home className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-muted-foreground">Enter your order number to see the latest status</p>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            <div className="flex gap-2">
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setOrderNumber(e.target.value)}
                placeholder="NCS-1234567890-ABCDE"
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Your order number was sent to your email and shown on the confirmation page
          </p>
        </form>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Order Not Found</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Order Details */}
      {order && (
        <>
          <Card className="p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Order {order.orderNumber}</h2>
                <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {order.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Storage Device</p>
                <p className="font-medium">
                  {order.storageSize}GB {order.storageType === "flash_drive" ? "Flash Drive" : "Memory Card"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              {order.trackingNumber && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <p className="font-medium">{order.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Carrier</p>
                    <p className="font-medium">{order.carrier}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
            <div className="space-y-6">
              {order.events.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0">{getStatusIcon(event.type, event.completed)}</div>
                    {index < order.events.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${event.completed ? "bg-green-500" : "bg-muted"}`}
                        style={{ minHeight: "40px" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-semibold ${event.completed ? "text-foreground" : "text-muted-foreground"}`}>
                        {event.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Help Section */}
          <Card className="p-6 mt-6 bg-muted/50">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions about your order, please contact us at support@notcloudstorage.com
            </p>
            <Button asChild variant="outline" size="sm">
              <a href="mailto:support@notcloudstorage.com">Contact Support</a>
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Not Cloud Storage</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Button asChild size="sm">
              <Link href="/order">Get Started</Link>
            </Button>
          </nav>
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
          <TrackingContent />
        </Suspense>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Not Cloud Storage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
