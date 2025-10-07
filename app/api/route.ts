import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // In a real implementation:
    // 1. Query database for orders with pagination
    // 2. Apply filters and sorting
    // 3. Return orders with customer info

    // Mock orders data
    const orders = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `order-${i + 1}`,
      orderNumber: `NCS-${Date.now() - i * 100000}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      status: ["payment_received", "files_downloading", "device_prepared", "shipped", "delivered"][
        Math.floor(Math.random() * 5)
      ],
      storageType: Math.random() > 0.5 ? "flash_drive" : "memory_card",
      storageSize: [32, 64, 128, 256][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      amount: [2999, 3999, 5999, 9999][Math.floor(Math.random() * 4)],
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error(" Admin orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
