"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  HardDrive,
  ArrowLeft,
  Download,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  FileText,
} from "lucide-react"

interface OrderFile {
  id: string
  fileName: string
  fileSize: number
  downloadStatus: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  storageType: string
  storageSize: number
  amount: number
  autoDelete: boolean
  createdAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
  shipping: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
  carrier?: string
  files: OrderFile[]
  fileCount: number
  totalSizeBytes: number
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editedStatus, setEditedStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadOrder()
  }, [orderNumber])

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load order")
      }

      setOrder(data.order)
      setEditedStatus(data.order.status)
      setTrackingNumber(data.order.trackingNumber || "")
      setCarrier(data.order.carrier || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateOrder = async () => {
    if (!order) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editedStatus,
          trackingNumber,
          carrier,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order")
      }

      await loadOrder()
      alert("Order updated successfully")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update order")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCloudFiles = async () => {
    if (!confirm("Are you sure you want to delete the cloud files for this order?")) return

    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/delete-cloud-files`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to delete cloud files")
      }

      alert("Cloud files deletion initiated")
      await loadOrder()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete cloud files")
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_payment":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "payment_received":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "files_downloading":
      case "files_downloaded":
        return <Download className="h-5 w-5 text-blue-500" />
      case "device_prepared":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HardDrive className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
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
        <main className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground">{error || "Unable to load order details"}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <Badge variant="outline" className="text-sm">
                {order.status.replace(/_/g, " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Order {order.orderNumber}</h1>
          <p className="text-muted-foreground">Created on {formatDate(order.createdAt)}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-1">
                <p>{order.shipping.addressLine1}</p>
                {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                </p>
                <p>{order.shipping.country}</p>
              </div>
            </Card>

            {/* Order Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Device</span>
                  <span className="font-medium">
                    {order.storageSize}GB {order.storageType === "flash_drive" ? "Flash Drive" : "Memory Card"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formatPrice(order.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files</span>
                  <span className="font-medium">{order.fileCount} files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Size</span>
                  <span className="font-medium">{formatSize(order.totalSizeBytes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto-delete</span>
                  <span className="font-medium">{order.autoDelete ? "Yes" : "No"}</span>
                </div>
              </div>
            </Card>

            {/* Files List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Files ({order.files.length})</h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download List
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {order.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(file.fileSize)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {file.downloadStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Update Status</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={editedStatus} onValueChange={setEditedStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_payment">Pending Payment</SelectItem>
                      <SelectItem value="payment_received">Payment Received</SelectItem>
                      <SelectItem value="files_downloading">Files Downloading</SelectItem>
                      <SelectItem value="files_downloaded">Files Downloaded</SelectItem>
                      <SelectItem value="device_prepared">Device Prepared</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input
                    id="carrier"
                    value={carrier}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCarrier(e.target.value)}
                    placeholder="USPS, FedEx, UPS..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleUpdateOrder} disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Update Order"}
                </Button>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                {order.paidAt && (
                  <div>
                    <p className="text-muted-foreground">Paid</p>
                    <p className="font-medium">{formatDate(order.paidAt)}</p>
                  </div>
                )}
                {order.shippedAt && (
                  <div>
                    <p className="text-muted-foreground">Shipped</p>
                    <p className="font-medium">{formatDate(order.shippedAt)}</p>
                  </div>
                )}
                {order.deliveredAt && (
                  <div>
                    <p className="text-muted-foreground">Delivered</p>
                    <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Danger Zone */}
            {order.autoDelete && !order.deliveredAt && (
              <Card className="p-6 border-destructive">
                <h2 className="text-lg font-semibold mb-2 text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Customer requested auto-delete. Delete cloud files after delivery confirmation.
                </p>
                <Button onClick={handleDeleteCloudFiles} variant="destructive" size="sm" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Cloud Files
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
