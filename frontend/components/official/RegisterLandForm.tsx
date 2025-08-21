"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, MapPin, User, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { registerLand } from "@/services/api"
import { validateWalletAddress, generateLandId } from "@/utils/helpers"

interface FormData {
  landId: string
  owner: string
  ownerWallet: string
  coordinates: string
  area: string
  description: string
}

export function RegisterLandForm() {
  const [formData, setFormData] = useState<FormData>({
    landId: "",
    owner: "",
    ownerWallet: "",
    coordinates: "",
    area: "",
    description: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const generateNewLandId = () => {
    const newId = generateLandId()
    setFormData((prev) => ({ ...prev, landId: newId }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.landId.trim()) newErrors.landId = "Land ID is required"
    if (!formData.owner.trim()) newErrors.owner = "Owner name is required"
    if (!formData.ownerWallet.trim()) {
      newErrors.ownerWallet = "Wallet address is required"
    } else if (!validateWalletAddress(formData.ownerWallet)) {
      newErrors.ownerWallet = "Invalid wallet address format"
    }
    if (!formData.coordinates.trim()) newErrors.coordinates = "Coordinates are required"
    if (!formData.area.trim()) newErrors.area = "Area is required"

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
        return prev + 15
      })
    }, 300)

    try {
      // Parse coordinates
      const [lat, lng] = formData.coordinates.split(",").map((coord) => Number.parseFloat(coord.trim()))

      const landData = {
        landId: formData.landId,
        owner: formData.owner,
        ownerWallet: formData.ownerWallet,
        coordinates: { lat, lng },
        area: Number.parseFloat(formData.area),
        description: formData.description,
      }

      const success = await registerLand(landData)
      setProgress(100)

      if (success) {
        setResult({
          success: true,
          message: `Land ${formData.landId} has been successfully registered on the blockchain.`,
        })
        // Reset form
        setFormData({
          landId: "",
          owner: "",
          ownerWallet: "",
          coordinates: "",
          area: "",
          description: "",
        })
        setFile(null)
      } else {
        setResult({
          success: false,
          message: "Registration failed. Please try again.",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred during registration. Please try again.",
      })
      setProgress(100)
    } finally {
      clearInterval(progressInterval)
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Register New Land Parcel</span>
          </CardTitle>
          <CardDescription>
            Add a new land parcel to the blockchain registry with complete ownership and location details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Land ID */}
            <div className="space-y-2">
              <Label htmlFor="landId">Land ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="landId"
                  value={formData.landId}
                  onChange={(e) => handleInputChange("landId", e.target.value)}
                  placeholder="e.g., LD001"
                  className={errors.landId ? "border-destructive" : ""}
                />
                <Button type="button" variant="outline" onClick={generateNewLandId} className="bg-transparent">
                  Generate ID
                </Button>
              </div>
              {errors.landId && <p className="text-sm text-destructive">{errors.landId}</p>}
            </div>

            {/* Owner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => handleInputChange("owner", e.target.value)}
                    placeholder="Full name of the property owner"
                    className={`pl-10 ${errors.owner ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.owner && <p className="text-sm text-destructive">{errors.owner}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerWallet">Owner Wallet Address</Label>
                <Input
                  id="ownerWallet"
                  value={formData.ownerWallet}
                  onChange={(e) => handleInputChange("ownerWallet", e.target.value)}
                  placeholder="0x..."
                  className={`font-mono ${errors.ownerWallet ? "border-destructive" : ""}`}
                />
                {errors.ownerWallet && <p className="text-sm text-destructive">{errors.ownerWallet}</p>}
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coordinates">Coordinates (Lat, Lng)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="coordinates"
                    value={formData.coordinates}
                    onChange={(e) => handleInputChange("coordinates", e.target.value)}
                    placeholder="40.7128, -74.0060"
                    className={`pl-10 ${errors.coordinates ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.coordinates && <p className="text-sm text-destructive">{errors.coordinates}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="1000"
                  className={errors.area ? "border-destructive" : ""}
                />
                {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Additional details about the property..."
                rows={3}
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <Label htmlFor="document">Property Document</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="text-center">
                    {file ? (
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Upload property document</p>
                        <p className="text-sm text-muted-foreground">PDF, DOC, or image files</p>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="block mt-2">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    {file ? "Change File" : "Choose File"}
                  </Button>
                </label>
              </div>
            </div>

            {/* Progress */}
            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registering on blockchain...</span>
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
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{result.message}</AlertDescription>
                </div>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[200px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Register Land
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
