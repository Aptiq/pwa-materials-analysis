import Link from "next/link"
import { Menu, Plus } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

export function SiteHeader() {
  const routes = [
    { href: "/", label: "Accueil" },
    { href: "/materials", label: "Matières" },
    { href: "/analyses", label: "Analyses" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 font-semibold"
          >
            <span className="hidden md:inline-block">Next.js PWA</span>
            <span className="inline-block md:hidden">PWA</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {routes.map((route) => (
              <Link 
                key={route.href}
                href={route.href} 
                className="hover:text-foreground/80 transition-colors px-2 py-1"
              >
                {route.label}
              </Link>
            ))}
            <ModeToggle />
          </nav>

          {/* Navigation Mobile */}
          <div className="flex items-center md:hidden space-x-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle>Menu de navigation</SheetTitle>
                <nav className="flex flex-col space-y-4 mt-4">
                  {routes.map((route) => (
                    <SheetClose asChild key={route.href}>
                      <Link
                        href={route.href}
                        className="text-foreground/60 hover:text-foreground transition-colors px-2 py-1"
                      >
                        {route.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                  <SheetClose asChild>
                    <Link href="/materials/new" className="w-full">
                      <Button className="w-full" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle matière
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}