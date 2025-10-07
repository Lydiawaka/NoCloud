import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, files, storageType, storageSize, amount, autoDelete, customer, shipping } = body

    // Validate required fields
    if (!sessionId || !storageType || !storageSize || !amount || !customer || !shipping) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `NCS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // In a real implementation:
    // 1. Retrieve OAuth tokens from session
    // 2. Create order in database
    // 3. Create Stripe payment intent
    // 4. Store order with payment intent ID
    // 5. Create initial order event (order created)

    // Mock order creation
    const order = {
      orderNumber,
      customerEmail: customer.email,
      customerName: customer.name,
      storageType,
      storageSize,
      amount,
      autoDelete,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
      shipping,
    }

    console.log(" Order created:", order)

    // In production, you would:
    // - Store order in database
    // - Create Stripe payment intent
    // - Send confirmation email
    // - Create order event timeline

    return NextResponse.json({
      orderNumber,
      clientSecret: "mock_client_secret", // Would be from Stripe
    })
  } catch (error) {
    console.error(" Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
