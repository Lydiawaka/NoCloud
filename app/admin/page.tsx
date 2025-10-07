"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Package, Clock, CheckCircle, TrendingUp, AlertTriangle, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  activeOrders: number
  completedOrders: number
  lowStockItems: number
  revenue: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  storageType: string
  storageSize: number
  createdAt: string
  amount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([fetch("/api/admin/stats"), fetch("/api/admin/orders?limit=10")])

      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()

      setStats(statsData.stats)
      setRecentOrders(ordersData.orders)
    } catch (error) {
      console.error(" Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "payment_received":
      case "files_downloading":
      case "files_downloaded":
      case "device_prepared":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HardDrive className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/">View Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{stats?.pendingOrders || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active</p>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{stats?.activeOrders || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completed</p>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{stats?.completedOrders || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Delivered</p>
          </Card>
        </div>

        {/* Revenue & Alerts */}
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Revenue</h2>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-4xl font-bold">{formatPrice(stats?.revenue || 0)}</p>
            <p className="text-sm text-muted-foreground mt-2">Total revenue from all orders</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Inventory Alerts</h2>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-4xl font-bold">{stats?.lowStockItems || 0}</p>
            <p className="text-sm text-muted-foreground mt-2">Items below threshold</p>
            <Button asChild variant="outline" size="sm" className="mt-4 bg-transparent">
              <Link href="/admin/inventory">View Inventory</Link>
            </Button>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Device</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/admin/orders/${order.orderNumber}`} className="font-medium hover:text-primary">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-sm">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.storageSize}GB {order.storageType === "flash_drive" ? "Flash" : "SD Card"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.amount)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/orders/${order.orderNumber}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {recentOrders.length} of {stats?.totalOrders} orders
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
