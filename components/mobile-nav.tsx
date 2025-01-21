"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Smartphone, Info, Mail, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const items = [
    {
      title: "Accueil",
      href: "/",
      icon: Home
    },
    {
      title: "Fonctionnalités",
      href: "/features",
      icon: Smartphone
    },
    {
      title: "À propos",
      href: "/about",
      icon: Info
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Mail
    }
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>Navigation</SheetTitle>
        <nav className="flex flex-col space-y-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 ${
                  pathname === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}