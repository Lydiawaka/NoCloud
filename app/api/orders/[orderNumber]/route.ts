import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await params

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number required" }, { status: 400 })
    }

    // In a real implementation:
    // 1. Query database for order by order number
    // 2. Return order details

    // Mock order data
    const order = {
      orderNumber,
      customerEmail: "customer@example.com",
      customerName: "John Doe",
      storageType: "flash_drive",
      storageSize: 64,
      status: "payment_received",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error(" Order fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
