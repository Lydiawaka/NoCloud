import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await params

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number required" }, { status: 400 })
    }

    // In a real implementation:
    // 1. Query database for order and events
    // 2. Return order with timeline events

    // Mock order data with timeline
    const order = {
      orderNumber,
      customerEmail: "customer@example.com",
      storageType: "flash_drive",
      storageSize: 64,
      status: "files_downloading",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      trackingNumber: null,
      carrier: null,
      events: [
        {
          id: "1",
          type: "payment_received",
          title: "Order Placed",
          description: "Your order has been received and payment confirmed.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
        },
        {
          id: "2",
          type: "files_downloading",
          title: "Downloading Files",
          description: "We are downloading your files from your cloud storage.",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
        },
        {
          id: "3",
          type: "files_downloaded",
          title: "Files Downloaded",
          description: "All files have been successfully downloaded.",
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          completed: true,
        },
        {
          id: "4",
          type: "device_prepared",
          title: "Preparing Device",
          description: "Your files are being transferred to the storage device.",
          createdAt: new Date().toISOString(),
          completed: false,
        },
        {
          id: "5",
          type: "shipped",
          title: "Shipped",
          description: "Your order has been shipped and is on its way.",
          createdAt: "",
          completed: false,
        },
        {
          id: "6",
          type: "delivered",
          title: "Delivered",
          description: "Your order has been delivered.",
          createdAt: "",
          completed: false,
        },
      ],
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Order tracking error:", error)
    return NextResponse.json({ error: "Failed to fetch order tracking" }, { status: 500 })
  }
}
