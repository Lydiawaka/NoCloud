"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { HardDrive, Loader2, AlertCircle, CreditCard } from "lucide-react"

interface StorageOption {
  type: "flash_drive" | "memory_card"
  size: number
  price: number
  available: boolean
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session")
  const filesParam = searchParams.get("files")

  const [storageOptions] = useState<StorageOption[]>([
    { type: "flash_drive", size: 32, price: 2999, available: true },
    { type: "flash_drive", size: 64, price: 3999, available: true },
    { type: "flash_drive", size: 128, price: 5999, available: true },
    { type: "flash_drive", size: 256, price: 9999, available: true },
    { type: "memory_card", size: 32, price: 2499, available: true },
    { type: "memory_card", size: 64, price: 3499, available: true },
    { type: "memory_card", size: 128, price: 5499, available: true },
    { type: "memory_card", size: 256, price: 9499, available: true },
  ])

  const [selectedStorage, setSelectedStorage] = useState<string>("")
  const [autoDelete, setAutoDelete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  })

  const selectedOption = storageOptions.find((opt) => `${opt.type}-${opt.size}` === selectedStorage)

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOption || !sessionId) return

    setIsProcessing(true)
    setError(null)

    try {
      // Create order and payment intent
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          files: filesParam?.split(",") || [],
          storageType: selectedOption.type,
          storageSize: selectedOption.size,
          amount: selectedOption.price,
          autoDelete,
          customer: {
            name: formData.name,
            email: formData.email,
          },
          shipping: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      // Redirect to Stripe Checkout or confirmation page
      router.push(`/order/confirmation?order=${data.orderNumber}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsProcessing(false)
    }
  }

  if (!sessionId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Invalid Session</h2>
        <p className="text-muted-foreground mb-4">Please start a new order.</p>
        <Button asChild>
          <Link href="/order">Start Over</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step 3 of 3</span>
          <span className="text-sm text-muted-foreground">Checkout & Payment</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-full transition-all" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Order</h1>
        <p className="text-muted-foreground">Choose your storage device and enter shipping details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Storage Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Storage Device</h2>

          <RadioGroup value={selectedStorage} onValueChange={setSelectedStorage}>
            <div className="space-y-3">
              <div className="font-medium text-sm text-muted-foreground mb-2">Flash Drives (USB 3.0)</div>
              {storageOptions
                .filter((opt) => opt.type === "flash_drive")
                .map((option) => (
                  <div key={`${option.type}-${option.size}`} className="flex items-center space-x-3">
                    <RadioGroupItem value={`${option.type}-${option.size}`} id={`${option.type}-${option.size}`} />
                    <Label
                      htmlFor={`${option.type}-${option.size}`}
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.size}GB Flash Drive</span>
                      <span className="font-semibold">{formatPrice(option.price)}</span>
                    </Label>
                  </div>
                ))}

              <div className="font-medium text-sm text-muted-foreground mb-2 mt-4">Memory Cards (SD)</div>
              {storageOptions
                .filter((opt) => opt.type === "memory_card")
                .map((option) => (
                  <div key={`${option.type}-${option.size}`} className="flex items-center space-x-3">
                    <RadioGroupItem value={`${option.type}-${option.size}`} id={`${option.type}-${option.size}`} />
                    <Label
                      htmlFor={`${option.type}-${option.size}`}
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.size}GB Memory Card</span>
                      <span className="font-semibold">{formatPrice(option.price)}</span>
                    </Label>
                  </div>
                ))}
            </div>
          </RadioGroup>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start space-x-3">
              <Checkbox id="auto-delete" checked={autoDelete} onCheckedChange={(checked: boolean) => setAutoDelete(!!checked)} />
              <div className="space-y-1">
                <Label htmlFor="auto-delete" className="cursor-pointer font-medium">
                  Auto-delete cloud files after delivery
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically delete your files from cloud storage once we confirm delivery
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
                placeholder="123 Main St"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Apt 4B"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  placeholder="NY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Order Summary */}
        {selectedOption && (
          <Card className="p-6 bg-muted/50">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Device</span>
                <span>
                  {selectedOption.size}GB {selectedOption.type === "flash_drive" ? "Flash Drive" : "Memory Card"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Included</span>
              </div>
              {autoDelete && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Auto-delete service</span>
                  <span>Free</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(selectedOption.price)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button type="button" asChild variant="outline">
            <Link href={`/order/select-files?session=${sessionId}`}>Back</Link>
          </Button>
          <Button type="submit" disabled={!selectedStorage || isProcessing} size="lg">
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Complete Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function CheckoutPage() {
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
          <CheckoutContent />
        </Suspense>
      </main>
    </div>
  )
}
