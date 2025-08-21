"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SearchSection } from "@/components/citizen/SearchSection"
import { SearchResults } from "@/components/citizen/SearchResults"
import { DocumentVerification } from "@/components/citizen/DocumentVerification"
import { InteractiveMap } from "@/components/map/InteractiveMap"
import { MapboxMap } from "@/components/map/MapboxMap"
import { LandDetailsModal } from "@/components/citizen/LandDetailsModal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, FileCheck, Map, Globe } from "lucide-react"
import type { LandRecord } from "@/services/api"
import { searchLand } from "@/services/api"

export default function CitizenPortalPage() {
  const [searchResults, setSearchResults] = useState<LandRecord[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLand, setSelectedLand] = useState<LandRecord | null>(null)
  const [mapType, setMapType] = useState<"interactive" | "mapbox">("interactive")
  const [mapLands, setMapLands] = useState<LandRecord[]>([])

  useState(() => {
    const loadMapData = async () => {
      try {
        const sampleResults = await searchLand("sample")
        setMapLands(sampleResults)
      } catch (error) {
        console.error("Failed to load map data:", error)
      }
    }
    loadMapData()
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif font-bold text-4xl text-foreground mb-4">Citizen Portal</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search land records, verify documents, and explore property information with complete transparency.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
              <TabsTrigger value="search" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </TabsTrigger>
              <TabsTrigger value="verify" className="flex items-center space-x-2">
                <FileCheck className="h-4 w-4" />
                <span>Verify</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center space-x-2">
                <Map className="h-4 w-4" />
                <span>Map</span>
              </TabsTrigger>
            </TabsList>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-6">
              <SearchSection
                onSearchResults={setSearchResults}
                onSearchStart={() => setIsSearching(true)}
                onSearchEnd={() => setIsSearching(false)}
              />
              <SearchResults results={searchResults} isLoading={isSearching} />
            </TabsContent>

            {/* Document Verification Tab */}
            <TabsContent value="verify" className="space-y-6">
              <DocumentVerification />
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif font-semibold">Interactive Land Registry Map</h2>
                    <p className="text-muted-foreground">
                      Click on land parcels to view ownership details and generate QR codes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={mapType === "interactive" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapType("interactive")}
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Interactive
                    </Button>
                    <Button
                      variant={mapType === "mapbox" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapType("mapbox")}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Mapbox
                    </Button>
                  </div>
                </div>

                {mapType === "interactive" ? (
                  <InteractiveMap lands={mapLands} onLandSelect={setSelectedLand} className="w-full" />
                ) : (
                  <MapboxMap lands={mapLands} onLandSelect={setSelectedLand} className="w-full" />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-border">
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">Land Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Search for land records using property ID or owner name. Get instant access to ownership details,
                coordinates, and document links.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <FileCheck className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="font-serif text-lg">Document Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload property documents to verify their authenticity against blockchain records. Detect any tampering
                or modifications instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <Map className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="font-serif text-lg">Interactive Map</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Explore land parcels on an interactive map. View boundaries, ownership information, and generate QR
                codes for easy sharing.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* Land Details Modal */}
        <LandDetailsModal land={selectedLand} onClose={() => setSelectedLand(null)} />
      </div>
    </div>
  )
}
