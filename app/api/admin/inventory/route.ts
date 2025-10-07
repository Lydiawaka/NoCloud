import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock inventory data
    const inventory = [
      { id: "1", storageType: "flash_drive", storageSize: 32, quantity: 45, lowStockThreshold: 10 },
      { id: "2", storageType: "flash_drive", storageSize: 64, quantity: 38, lowStockThreshold: 10 },
      { id: "3", storageType: "flash_drive", storageSize: 128, quantity: 8, lowStockThreshold: 10 },
      { id: "4", storageType: "flash_drive", storageSize: 256, quantity: 15, lowStockThreshold: 5 },
      { id: "5", storageType: "memory_card", storageSize: 32, quantity: 32, lowStockThreshold: 10 },
      { id: "6", storageType: "memory_card", storageSize: 64, quantity: 28, lowStockThreshold: 10 },
      { id: "7", storageType: "memory_card", storageSize: 128, quantity: 4, lowStockThreshold: 10 },
      { id: "8", storageType: "memory_card", storageSize: 256, quantity: 12, lowStockThreshold: 5 },
    ]

    return NextResponse.json({ inventory })
  } catch (error) {
    console.error(" Inventory fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}
