"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, QrCode, FileText, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateQRCode } from "@/utils/helpers"
import type { LandRecord } from "@/services/api"

interface InteractiveMapProps {
  lands: LandRecord[]
  onLandSelect?: (land: LandRecord) => void
  className?: string
}

interface MapPopupData {
  land: LandRecord
  position: { x: number; y: number }
}

export function InteractiveMap({ lands, onLandSelect, className = "" }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedLand, setSelectedLand] = useState<MapPopupData | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  // Mock map data - in real implementation, this would be actual GeoJSON
  const mockMapData = [
    { id: "LAND001", x: 20, y: 30, width: 80, height: 60, color: "bg-emerald-500" },
    { id: "LAND002", x: 120, y: 40, width: 70, height: 80, color: "bg-blue-500" },
    { id: "LAND003", x: 210, y: 20, width: 90, height: 70, color: "bg-purple-500" },
    { id: "LAND004", x: 30, y: 120, width: 85, height: 65, color: "bg-orange-500" },
    { id: "LAND005", x: 140, y: 140, width: 75, height: 55, color: "bg-pink-500" },
  ]

  const handleLandClick = async (event: React.MouseEvent, landId: string) => {
    const land = lands.find((l) => l.landId === landId)
    if (!land) return

    const rect = mapRef.current?.getBoundingClientRect()
    if (!rect) return

    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setSelectedLand({ land, position })

    // Generate QR code for the selected land
    const qrData = JSON.stringify({
      landId: land.landId,
      owner: land.owner,
      coordinates: land.coordinates,
      verificationUrl: `${window.location.origin}/citizen?verify=${land.landId}`,
    })
    const qrUrl = await generateQRCode(qrData)
    setQrCodeUrl(qrUrl)

    onLandSelect?.(land)
  }

  const closePopup = () => {
    setSelectedLand(null)
    setQrCodeUrl("")
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Interactive Land Registry Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={mapRef}
          className="relative w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden cursor-crosshair"
          onClick={(e) => {
            // Close popup if clicking on empty area
            if (e.target === e.currentTarget) {
              closePopup()
            }
          }}
        >
          {/* Mock land parcels */}
          {mockMapData.map((parcel) => {
            const land = lands.find((l) => l.landId === parcel.id)
            return (
              <motion.div
                key={parcel.id}
                className={`absolute border-2 border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl ${parcel.color} opacity-70 hover:opacity-90`}
                style={{
                  left: parcel.x,
                  top: parcel.y,
                  width: parcel.width,
                  height: parcel.height,
                }}
                onClick={(e) => handleLandClick(e, parcel.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                    {parcel.id}
                  </span>
                </div>
              </motion.div>
            )
          })}

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
            <h4 className="font-semibold text-sm">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span>Residential</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Commercial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Industrial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Agricultural</span>
              </div>
            </div>
          </div>

          {/* Land Details Popup */}
          <AnimatePresence>
            {selectedLand && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute z-10 bg-white rounded-lg shadow-xl border p-4 min-w-80"
                style={{
                  left: Math.min(selectedLand.position.x, (mapRef.current?.clientWidth || 400) - 320),
                  top: Math.max(selectedLand.position.y - 200, 10),
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{selectedLand.land.landId}</h3>
                    <Button variant="ghost" size="sm" onClick={closePopup} className="h-6 w-6 p-0">
                      ×
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Owner:</strong> {selectedLand.land.owner}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Location:</strong> {selectedLand.land.coordinates}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Status:</strong>
                        <Badge variant="secondary" className="ml-2">
                          {selectedLand.land.status}
                        </Badge>
                      </span>
                    </div>
                  </div>

                  {qrCodeUrl && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quick Access QR</span>
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-16 h-16 border rounded" />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" onClick={() => onLandSelect?.(selectedLand.land)} className="flex-1">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Generate and download QR code
                        if (qrCodeUrl) {
                          const link = document.createElement("a")
                          link.href = qrCodeUrl
                          link.download = `${selectedLand.land.landId}-qr.png`
                          link.click()
                        }
                      }}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
