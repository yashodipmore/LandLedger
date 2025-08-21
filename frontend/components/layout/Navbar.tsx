"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, X, Shield, User, Building, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "official":
        return <Shield className="h-4 w-4" />
      case "owner":
        return <User className="h-4 w-4" />
      case "citizen":
        return <Users className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "official":
        return "text-primary"
      case "owner":
        return "text-secondary"
      case "citizen":
        return "text-accent"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Building className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="font-serif font-bold text-xl text-foreground">LandLedger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/citizen" className="text-foreground hover:text-primary transition-colors">
              Citizen Portal
            </Link>
            {isAuthenticated && user?.role === "official" && (
              <Link href="/official" className="text-foreground hover:text-primary transition-colors">
                Official Portal
              </Link>
            )}
            {isAuthenticated && user?.role === "owner" && (
              <Link href="/owner" className="text-foreground hover:text-primary transition-colors">
                Owner Portal
              </Link>
            )}
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(user?.role || "")}
                      <span className={`text-sm font-medium ${getRoleColor(user?.role || "")}`}>
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button>Sign In</Button>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/citizen" className="text-foreground hover:text-primary transition-colors">
                  Citizen Portal
                </Link>
                {isAuthenticated && user?.role === "official" && (
                  <Link href="/official" className="text-foreground hover:text-primary transition-colors">
                    Official Portal
                  </Link>
                )}
                {isAuthenticated && user?.role === "owner" && (
                  <Link href="/owner" className="text-foreground hover:text-primary transition-colors">
                    Owner Portal
                  </Link>
                )}
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>

                {isAuthenticated ? (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={logout} className="w-full bg-transparent">
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
