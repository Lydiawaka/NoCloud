"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { HardDrive, Loader2, File, Folder, ChevronRight, AlertCircle } from "lucide-react"

interface CloudFile {
  id: string
  name: string
  type: "file" | "folder"
  size: number
  mimeType?: string
  path: string
}

function SelectFilesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session")

  const [files, setFiles] = useState<CloudFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [currentPath, setCurrentPath] = useState("/")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalSize, setTotalSize] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid session")
      setIsLoading(false)
      return
    }

    loadFiles(currentPath)
  }, [sessionId, currentPath])

  const loadFiles = async (path: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cloud/files?session=${sessionId}&path=${encodeURIComponent(path)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load files")
      }

      setFiles(data.files)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFile = (fileId: string, size: number) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
      setTotalSize(totalSize - size)
    } else {
      newSelected.add(fileId)
      setTotalSize(totalSize + size)
    }
    setSelectedFiles(newSelected)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const handleContinue = () => {
    // Store selected files in session and continue to payment
    const selectedFileIds = Array.from(selectedFiles)
    router.push(`/order/checkout?session=${sessionId}&files=${selectedFileIds.join(",")}`)
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
          <span className="text-sm font-medium">Step 2 of 3</span>
          <span className="text-sm text-muted-foreground">Select Files</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3 transition-all" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Select Files to Transfer</h1>
        <p className="text-muted-foreground">Choose the files and folders you want on your storage device</p>
      </div>

      {/* Selection Summary */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Selected Files</p>
            <p className="text-2xl font-bold">{selectedFiles.size}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Size</p>
            <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
          </div>
        </div>
      </Card>

      {/* File Browser */}
      <Card className="p-6">
        {/* Current Path */}
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <button onClick={() => setCurrentPath("/")} className="hover:text-foreground">
            Home
          </button>
          {currentPath !== "/" && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{currentPath}</span>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No files found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={selectedFiles.has(file.id)}
                  onCheckedChange={() => toggleFile(file.id, file.size)}
                  disabled={file.type === "folder"}
                />
                {file.type === "folder" ? (
                  <Folder className="h-5 w-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {file.type === "folder" ? (
                    <button
                      onClick={() => setCurrentPath(file.path)}
                      className="font-medium hover:text-primary truncate block text-left"
                    >
                      {file.name}
                    </button>
                  ) : (
                    <p className="font-medium truncate">{file.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                {file.type === "folder" && <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <Button asChild variant="outline">
          <Link href="/order">Cancel</Link>
        </Button>
        <Button onClick={handleContinue} disabled={selectedFiles.size === 0} size="lg">
          Continue to Checkout
        </Button>
      </div>
    </div>
  )
}

export default function SelectFilesPage() {
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
          <SelectFilesContent />
        </Suspense>
      </main>
    </div>
  )
}
