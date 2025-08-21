"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Users, Building, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/context/AuthContext"

const roleOptions = [
  { value: "citizen", label: "Citizen", icon: Users, description: "Search and verify land records" },
  { value: "official", label: "Government Official", icon: Shield, description: "Register land and approve transfers" },
  { value: "owner", label: "Property Owner", icon: Building, description: "Manage and transfer properties" },
]

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !role) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password, role)
      if (success) {
        // Redirect based on role
        switch (role) {
          case "citizen":
            router.push("/citizen")
            break
          case "official":
            router.push("/official")
            break
          case "owner":
            router.push("/owner")
            break
          default:
            router.push("/")
        }
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h2 className="font-serif font-bold text-3xl text-foreground">Sign In to LandLedger</h2>
          <p className="mt-2 text-sm text-muted-foreground">Access your portal based on your role in the system</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif">Authentication</CardTitle>
            <CardDescription>Enter your credentials to access your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role</Label>
                <Select value={role || ""} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {role && (
                  <p className="text-sm text-muted-foreground">
                    {roleOptions.find((r) => r.value === role)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Demo credentials: Use any email/password combination with your selected role
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Information Cards */}
        <div className="grid gap-4">
          {roleOptions.map((option) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  role === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setRole(option.value as UserRole)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${role === option.value ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <h3 className="font-medium text-sm">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
