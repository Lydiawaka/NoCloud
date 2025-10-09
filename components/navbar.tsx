import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"  
export function Navbar() {
  return (
   <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"        
              alt="Not Cloud Storage Logo"
              width={16}                
              height={16}
              className="rounded-md"   
            />
            <span className="text-base font-semibold">Not Cloud Storage</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Track Order
            </Link>
            <Button asChild size="sm">
              <Link href="/order">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
  );
}