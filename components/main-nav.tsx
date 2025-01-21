"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Smartphone, Info, Mail } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MainNav() {
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
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavigationMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  active={pathname === item.href}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}