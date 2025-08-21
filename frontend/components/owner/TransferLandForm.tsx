"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowRightLeft, Wallet, Building, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { getOwnerProperties, transferLand, type LandRecord } from "@/services/api"
import { validateWalletAddress, formatWalletAddress } from "@/utils/helpers"

export function TransferLandForm() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<LandRecord[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string>("")
  const [newOwnerWallet, setNewOwnerWallet] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [errors, setErrors] = useState<{ property?: string; wallet?: string }>({})

  useEffect(() => {
    loadProperties()
  }, [user])

  const loadProperties = async () => {
    if (!user?.walletAddress) return

    setIsLoading(true)
    try {
      const ownerProperties = await getOwnerProperties(user.walletAddress)
      // Only show active properties that can be transferred
      const activeProperties = ownerProperties.filter((p) => p.status === "active")
      setProperties(activeProperties)
    } catch (error) {
      console.error("Failed to load properties:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { property?: string; wallet?: string } = {}

    if (!selectedProperty) {
      newErrors.property = "Please select a property to transfer"
    }

    if (!newOwnerWallet.trim()) {
      newErrors.wallet = "New owner wallet address is required"
    } else if (!validateWalletAddress(newOwnerWallet)) {
      newErrors.wallet = "Invalid wallet address format"
    } else if (newOwnerWallet.toLowerCase() === user?.walletAddress?.toLowerCase()) {
      newErrors.wallet = "Cannot transfer to your own wallet address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setProgress(0)
    setResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 20
      })
    }, 400)

    try {
      const success = await transferLand(selectedProperty, newOwnerWallet)
      setProgress(100)

      if (success) {
        setResult({
          success: true,
          message: `Transfer request submitted successfully! The property ${selectedProperty} is now pending government approval.`,
        })
        // Reset form
        setSelectedProperty("")
        setNewOwnerWallet("")
        // Reload properties to update status
        await loadProperties()
      } else {
        setResult({
          success: false,
          message: "Transfer request failed. Please try again.",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred during transfer. Please try again.",
      })
      setProgress(100)
    } finally {
      clearInterval(progressInterval)
      setIsSubmitting(false)
    }
  }

  const selectedPropertyDetails = properties.find((p) => p.landId === selectedProperty)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="h-5 w-5" />
            <span>Transfer Property Ownership</span>
          </CardTitle>
          <CardDescription>
            Initiate a secure property transfer to a new owner. All transfers require government approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-secondary mr-2" />
              <span>Loading your properties...</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No Transferable Properties</p>
              <p className="text-muted-foreground">You don't have any active properties available for transfer.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Selection */}
              <div className="space-y-2">
                <Label htmlFor="property">Select Property to Transfer</Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className={errors.property ? "border-destructive" : ""}>
                    <SelectValue placeholder="Choose a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.landId} value={property.landId}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono">{property.landId}</span>
                          <span className="text-sm text-muted-foreground ml-4">
                            {property.area.toLocaleString()} sq ft
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.property && <p className="text-sm text-destructive">{errors.property}</p>}
              </div>

              {/* Property Details */}
              {selectedPropertyDetails && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Property Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Land ID:</span>
                        <span className="ml-2 font-mono">{selectedPropertyDetails.landId}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Area:</span>
                        <span className="ml-2">{selectedPropertyDetails.area.toLocaleString()} sq ft</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span className="ml-2 font-mono text-xs">
                          {selectedPropertyDetails.coordinates.lat.toFixed(4)},{" "}
                          {selectedPropertyDetails.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-2">
                          <Badge variant="default">{selectedPropertyDetails.status}</Badge>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* New Owner Wallet */}
              <div className="space-y-2">
                <Label htmlFor="newOwnerWallet">New Owner Wallet Address</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newOwnerWallet"
                    value={newOwnerWallet}
                    onChange={(e) => {
                      setNewOwnerWallet(e.target.value)
                      if (errors.wallet) setErrors((prev) => ({ ...prev, wallet: "" }))
                    }}
                    placeholder="0x..."
                    className={`pl-10 font-mono ${errors.wallet ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.wallet && <p className="text-sm text-destructive">{errors.wallet}</p>}
                {newOwnerWallet && validateWalletAddress(newOwnerWallet) && (
                  <p className="text-sm text-muted-foreground">Formatted: {formatWalletAddress(newOwnerWallet)}</p>
                )}
              </div>

              {/* Progress */}
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing transfer request...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Result */}
              {result && (
                <Alert variant={result.success ? "default" : "destructive"}>
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertDescription>{result.message}</AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedProperty || !newOwnerWallet}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Submit Transfer
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Transfer Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Transfer Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowRightLeft className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-medium">1. Submit Request</h3>
              <p className="text-sm text-muted-foreground">Submit transfer request with new owner's wallet address</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">2. Government Review</h3>
              <p className="text-sm text-muted-foreground">Government officials review and approve the transfer</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Building className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium">3. Ownership Updated</h3>
              <p className="text-sm text-muted-foreground">Blockchain records updated with new ownership</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
