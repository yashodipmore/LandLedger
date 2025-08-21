"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Download, Copy, Check } from "lucide-react"
import { generateQRCode } from "@/utils/helpers"
import { motion } from "framer-motion"

interface QRCodeGeneratorProps {
  defaultData?: string
  title?: string
  className?: string
}

export function QRCodeGenerator({
  defaultData = "",
  title = "QR Code Generator",
  className = "",
}: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState(defaultData)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!qrData.trim()) return

    setIsGenerating(true)
    try {
      const url = await generateQRCode(qrData)
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = "qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-data">Data to encode</Label>
          <Textarea
            id="qr-data"
            placeholder="Enter text, URL, or JSON data to generate QR code..."
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleGenerate} disabled={!qrData.trim() || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </>
          )}
        </Button>

        {qrCodeUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white border rounded-lg shadow-sm">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Generated QR Code" className="w-48 h-48" />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1 bg-transparent">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Data
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
