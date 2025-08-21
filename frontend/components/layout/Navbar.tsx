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
    <nav className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 200, duration: 0.6 }}
              className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
            >
              <Building className="h-8 w-8 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LandLedger
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                Blockchain Registry
              </span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium group">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </Link>
            <Link href="/citizen" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium group">
              <span className="relative z-10">Citizen Portal</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </Link>
            {isAuthenticated && user?.role === "official" && (
              <Link href="/official" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium group">
                <span className="relative z-10">Official Portal</span>
                <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              </Link>
            )}
            {isAuthenticated && user?.role === "owner" && (
              <Link href="/owner" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium group">
                <span className="relative z-10">Owner Portal</span>
                <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              </Link>
            )}
            <Link href="/dashboard" className="relative px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium group">
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </Link>
          </div>

          {/* Enhanced User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="ghost" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-lg ${
                          user?.role === 'official' ? 'bg-primary/10' : 
                          user?.role === 'owner' ? 'bg-secondary/10' : 'bg-accent/10'
                        }`}>
                          {getRoleIcon(user?.role || "")}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                          <span className={`text-xs font-medium ${getRoleColor(user?.role || "")}`}>
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 mb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {getRoleIcon(user?.role || "")}
                        <span className={`text-xs font-medium ${getRoleColor(user?.role || "")}`}>
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={logout} className="text-destructive font-medium p-3 rounded-lg hover:bg-destructive/10">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg font-semibold">
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-primary/10 transition-all duration-200"
              >
                {isMobileMenuOpen ? 
                  <X className="h-6 w-6 text-foreground" /> : 
                  <Menu className="h-6 w-6 text-foreground" />
                }
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden py-6 border-t border-border/50 bg-white/50 backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                <Link href="/" className="px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg font-medium">
                  Home
                </Link>
                <Link href="/citizen" className="px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg font-medium">
                  Citizen Portal
                </Link>
                {isAuthenticated && user?.role === "official" && (
                  <Link href="/official" className="px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg font-medium">
                    Official Portal
                  </Link>
                )}
                {isAuthenticated && user?.role === "owner" && (
                  <Link href="/owner" className="px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg font-medium">
                    Owner Portal
                  </Link>
                )}
                <Link href="/dashboard" className="px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg font-medium">
                  Dashboard
                </Link>

                {isAuthenticated ? (
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <div className="flex items-center space-x-3 mb-4 px-4 py-3 bg-muted/30 rounded-lg">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getRoleIcon(user?.role || "")}
                          <span className={`text-xs font-medium ${getRoleColor(user?.role || "")}`}>
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={logout} 
                      className="w-full bg-transparent hover:bg-destructive/10 hover:text-destructive border-destructive/20 font-medium"
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <Link href="/auth">
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg font-semibold">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
