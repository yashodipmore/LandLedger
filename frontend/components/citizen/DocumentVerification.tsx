"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"
import { verifyDocument } from "@/services/api"

export function DocumentVerification() {
  const [file, setFile] = useState<File | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean
    message: string
  } | null>(null)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setVerificationResult(null)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setVerificationResult(null)
    }
  }

  const handleVerification = async () => {
    if (!file) return

    setIsVerifying(true)
    setProgress(0)
    setVerificationResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await verifyDocument(file)
      setVerificationResult(result)
      setProgress(100)
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message: "Verification failed. Please try again.",
      })
      setProgress(100)
    } finally {
      clearInterval(progressInterval)
      setIsVerifying(false)
    }
  }

  const resetVerification = () => {
    setFile(null)
    setVerificationResult(null)
    setProgress(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Document Verification</span>
          </CardTitle>
          <CardDescription>
            Upload a property document to verify its authenticity against blockchain records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : file
                  ? "border-green-500 bg-green-50"
                  : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <Button variant="outline" size="sm" onClick={resetVerification}>
                  Choose Different File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your PDF document here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer bg-transparent">
                    Browse Files
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Verification Progress */}
          {isVerifying && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verifying document...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Verification Result */}
          {verificationResult && (
            <Alert variant={verificationResult.isValid ? "default" : "destructive"}>
              <div className="flex items-center space-x-2">
                {verificationResult.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription className="flex-1">{verificationResult.message}</AlertDescription>
              </div>
            </Alert>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <Button onClick={handleVerification} disabled={!file || isVerifying} size="lg" className="min-w-[200px]">
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Verify Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>How Document Verification Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">1. Upload Document</h3>
              <p className="text-sm text-muted-foreground">Upload your property document (PDF format)</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-medium">2. Generate Hash</h3>
              <p className="text-sm text-muted-foreground">System generates cryptographic hash of your document</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium">3. Verify Against Blockchain</h3>
              <p className="text-sm text-muted-foreground">Compare hash with blockchain records for authenticity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
