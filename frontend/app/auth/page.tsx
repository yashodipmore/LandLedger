"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useWeb3Context } from "@/context/Web3Context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Users, Building, ArrowLeft, Wallet, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/context/AuthContext"

const roleOptions = [
  { 
    value: "citizen", 
    label: "Citizen", 
    icon: Users, 
    description: "Search and verify land records on blockchain",
    features: ["View property details", "Verify documents", "Search land registry"]
  },
  { 
    value: "official", 
    label: "Government Official", 
    icon: Shield, 
    description: "Register land and approve transfers on blockchain",
    features: ["Register new properties", "Approve transfers", "Verify documents", "Manage registry"]
  },
  { 
    value: "owner", 
    label: "Property Owner", 
    icon: Building, 
    description: "Manage and transfer your properties on blockchain",
    features: ["View owned properties", "Transfer ownership", "Get QR codes", "Track history"]
  },
]

export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [error, setError] = useState("")
  const { user, setUserRole, isAuthenticated } = useAuth()
  const { account, isConnected, connectWallet, isLoading: web3Loading, error: web3Error } = useWeb3Context()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      // Redirect based on role
      switch (user.role) {
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
          break
      }
    }
  }, [isAuthenticated, user?.role, router])

  const handleConnectWallet = async () => {
    setError("")
    try {
      await connectWallet()
    } catch (err) {
      setError("Failed to connect wallet. Please try again.")
    }
  }

  const handleRoleSelection = () => {
    if (!selectedRole) {
      setError("Please select your role")
      return
    }
    setUserRole(selectedRole)
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
          <h2 className="font-serif font-bold text-3xl text-foreground">Connect to LandLedger</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure blockchain authentication via MetaMask wallet
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Blockchain Authentication</span>
            </CardTitle>
            <CardDescription>Connect your wallet and select your role to access the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {web3Error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{web3Error}</AlertDescription>
              </Alert>
            )}

            {/* Wallet Connection Status */}
            {isConnected ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Wallet connected: {account?.substring(0, 6)}...{account?.substring(38)}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={handleConnectWallet}
                  disabled={web3Loading}
                  className="w-full"
                  size="lg"
                >
                  {web3Loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect MetaMask Wallet
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Connect your MetaMask wallet for secure blockchain authentication
                </p>
              </div>
            )}

            {/* Role Selection */}
            {isConnected && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Your Role</label>
                  <Select value={selectedRole || ""} onValueChange={(value) => setSelectedRole(value as UserRole)}>
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
                  {selectedRole && (
                    <p className="text-sm text-muted-foreground">
                      {roleOptions.find((r) => r.value === selectedRole)?.description}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleRoleSelection}
                  disabled={!selectedRole}
                  className="w-full"
                  size="lg"
                >
                  Access Platform
                </Button>
              </div>
            )}
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
                  selectedRole === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole(option.value as UserRole)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${selectedRole === option.value ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                    <div className="space-y-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
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
