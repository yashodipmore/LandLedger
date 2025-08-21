"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Layers, ZoomIn, ZoomOut } from "lucide-react"
import { motion } from "framer-motion"
import type { LandRecord } from "@/services/api"

interface MapboxMapProps {
  lands: LandRecord[]
  onLandSelect?: (land: LandRecord) => void
  className?: string
}

export function MapboxMap({ lands, onLandSelect, className = "" }: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<"satellite" | "streets">("streets")

  // Mock Mapbox implementation - in production, use actual Mapbox GL JS
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const mockGeoJSONData = {
    type: "FeatureCollection",
    features: lands.map((land, index) => ({
      type: "Feature",
      properties: {
        landId: land.landId,
        owner: land.owner,
        status: land.status,
        area: `${Math.floor(Math.random() * 5000) + 1000} sq ft`,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.0059 + index * 0.001, 40.7128 + index * 0.0005],
            [-74.0049 + index * 0.001, 40.7128 + index * 0.0005],
            [-74.0049 + index * 0.001, 40.7138 + index * 0.0005],
            [-74.0059 + index * 0.001, 40.7138 + index * 0.0005],
            [-74.0059 + index * 0.001, 40.7128 + index * 0.0005],
          ],
        ],
      },
    })),
  }

  return (
    <Card className={`relative ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Mapbox Land Registry</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedLayer === "streets" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLayer("streets")}
            >
              Streets
            </Button>
            <Button
              variant={selectedLayer === "satellite" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLayer("satellite")}
            >
              Satellite
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div
            ref={mapContainerRef}
            className={`w-full h-96 rounded-b-lg overflow-hidden ${
              selectedLayer === "satellite"
                ? "bg-gradient-to-br from-green-800 to-brown-600"
                : "bg-gradient-to-br from-gray-100 to-gray-300"
            }`}
          >
            {!mapLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Loading Mapbox...</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Mock map background */}
                <div
                  className={`absolute inset-0 ${
                    selectedLayer === "satellite"
                      ? 'bg-[url("/satellite-map.png")] bg-cover bg-center'
                      : 'bg-[url("/street-map.png")] bg-cover bg-center'
                  }`}
                >
                  {/* Land parcels overlay */}
                  {mockGeoJSONData.features.map((feature, index) => (
                    <motion.div
                      key={feature.properties.landId}
                      className="absolute border-2 border-primary bg-primary/20 hover:bg-primary/40 cursor-pointer transition-all duration-200"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`,
                        width: "80px",
                        height: "60px",
                      }}
                      onClick={() => {
                        const land = lands.find((l) => l.landId === feature.properties.landId)
                        if (land) onLandSelect?.(land)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                          {feature.properties.landId}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Map controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>

                {/* Attribution */}
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
                  © Mapbox © OpenStreetMap
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
