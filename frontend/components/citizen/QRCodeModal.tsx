"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Download, Copy, Check } from "lucide-react"
import { generateQRCode } from "@/utils/helpers"
import type { LandRecord } from "@/services/api"

interface QRCodeModalProps {
  land: LandRecord | null
  onClose: () => void
}

export function QRCodeModal({ land, onClose }: QRCodeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsOpen(!!land)
    if (land) {
      generateQRData()
    }
  }, [land])

  const generateQRData = async () => {
    if (!land) return

    const qrData = JSON.stringify({
      landId: land.landId,
      owner: land.owner,
      ownerWallet: land.ownerWallet,
      coordinates: land.coordinates,
      registrationDate: land.registrationDate,
      ipfsHash: land.ipfsHash,
      verificationUrl: `${window.location.origin}/citizen?verify=${land.landId}`,
    })

    const qrUrl = await generateQRCode(qrData)
    setQrCodeUrl(qrUrl)
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      onClose()
      setQrCodeUrl("")
    }, 300)
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl || !land) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `${land.landId}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async () => {
    if (!land) return

    const qrData = JSON.stringify({
      landId: land.landId,
      owner: land.owner,
      ownerWallet: land.ownerWallet,
      coordinates: land.coordinates,
      registrationDate: land.registrationDate,
      ipfsHash: land.ipfsHash,
      verificationUrl: `${window.location.origin}/citizen?verify=${land.landId}`,
    })

    try {
      await navigator.clipboard.writeText(qrData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (!land) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code - {land.landId}</span>
          </DialogTitle>
          <DialogDescription>Scan this QR code to quickly access land information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              {qrCodeUrl ? (
                <img src={qrCodeUrl || "/placeholder.svg"} alt={`QR Code for ${land.landId}`} className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              This QR code contains land information including ownership details, coordinates, and verification links.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={downloadQRCode} disabled={!qrCodeUrl} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
