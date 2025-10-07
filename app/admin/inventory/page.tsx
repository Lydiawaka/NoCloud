"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertTriangle, Package } from "lucide-react"

interface InventoryItem {
  id: string
  storageType: string
  storageSize: number
  quantity: number
  lowStockThreshold: number
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      const response = await fetch("/api/admin/inventory")
      const data = await response.json()
      setInventory(data.inventory)
    } catch (error) {
      console.error(" Failed to load inventory:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {
      await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      await loadInventory()
    } catch (error) {
      console.error(" Failed to update inventory:", error)
    }
  }

  const isLowStock = (item: InventoryItem) => item.quantity <= item.lowStockThreshold

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Manage storage device inventory levels</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {inventory.map((item) => (
            <Card key={item.id} className={`p-6 ${isLowStock(item) ? "border-yellow-500" : ""}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.storageSize}GB {item.storageType === "flash_drive" ? "Flash Drive" : "Memory Card"}
                  </h3>
                  <p className="text-sm text-muted-foreground">Low stock threshold: {item.lowStockThreshold} units</p>
                </div>
                {isLowStock(item) && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`quantity-${item.id}`}>Current Quantity</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity + 10)}>
                      +10
                    </Button>
                  </div>
                </div>

                {isLowStock(item) && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-500">
                      Low stock alert! Only {item.quantity} units remaining.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
