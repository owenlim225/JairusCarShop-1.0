import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Car className="h-12 w-12 text-muted-foreground" aria-hidden />
      <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        The page you’re looking for doesn’t exist or was moved.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
