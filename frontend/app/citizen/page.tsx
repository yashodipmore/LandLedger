"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SearchSection } from "@/components/citizen/SearchSection"
import { SearchResults } from "@/components/citizen/SearchResults"
import { DocumentVerification } from "@/components/citizen/DocumentVerification"
import { InteractiveMap } from "@/components/map/InteractiveMap"
import { MapboxMap } from "@/components/map/MapboxMap"
import { LandDetailsModal } from "@/components/citizen/LandDetailsModal"
import { Footer } from "@/components/layout/Footer"
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
      // Load initial properties for map view
      try {
        const initialResults = await searchLand("")
        setMapLands(initialResults)
      } catch (error) {
        console.error("Failed to load initial properties:", error)
      }
    }
    loadMapData()
  })

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-green-50/20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.01)_1px,transparent_1px)] bg-[size:200px_200px]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-primary/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-green-500/40 rounded-full animate-bounce"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-500/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-secondary/30 rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary via-blue-500 to-green-500 rounded-2xl shadow-xl flex items-center justify-center transform rotate-6">
                  <Search className="h-8 w-8 text-white transform -rotate-6" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
              </div>
              <div className="text-left">
                <h1 className="font-sans font-bold text-4xl sm:text-5xl text-foreground tracking-tight">
                  Citizen <span className="text-primary">Portal</span>
                </h1>
                <p className="font-medium text-lg text-primary/80 tracking-wide">
                  Explore & Verify Land Records
                </p>
              </div>
            </div>
          </div>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Access transparent land records, verify document authenticity, and explore property information with 
            <span className="text-primary font-semibold"> blockchain-powered security</span>.
          </motion.p>
        </motion.div>

        {/* Enhanced Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <Tabs defaultValue="search" className="space-y-8">
            {/* Enhanced Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg border border-border/50">
                <TabsTrigger 
                  value="search" 
                  className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white font-medium transition-all duration-300"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="verify" 
                  className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white font-medium transition-all duration-300"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Verify</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white font-medium transition-all duration-300"
                >
                  <Map className="h-4 w-4" />
                  <span>Map</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Enhanced Search Tab */}
            <TabsContent value="search" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6"
              >
                <SearchSection
                  onSearchResults={setSearchResults}
                  onSearchStart={() => setIsSearching(true)}
                  onSearchEnd={() => setIsSearching(false)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <SearchResults results={searchResults} isLoading={isSearching} />
              </motion.div>
            </TabsContent>

            {/* Enhanced Document Verification Tab */}
            <TabsContent value="verify" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6"
              >
                <DocumentVerification />
              </motion.div>
            </TabsContent>

            {/* Enhanced Map Tab */}
            <TabsContent value="map" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-sans font-bold text-foreground">Interactive Land Registry Map</h2>
                      <p className="text-muted-foreground font-medium">
                        Click on land parcels to view ownership details and generate QR codes
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={mapType === "interactive" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMapType("interactive")}
                          className="font-medium"
                        >
                          <Map className="h-4 w-4 mr-2" />
                          Interactive
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={mapType === "mapbox" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMapType("mapbox")}
                          className="font-medium"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Mapbox
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {mapType === "interactive" ? (
                    <InteractiveMap lands={mapLands} onLandSelect={setSelectedLand} className="w-full" />
                  ) : (
                    <MapboxMap lands={mapLands} onLandSelect={setSelectedLand} className="w-full" />
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Enhanced Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-border/50 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-sans font-bold text-xl text-foreground">Land Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed font-medium">
                  Search for land records using property ID or owner name. Get instant access to ownership details,
                  coordinates, and document links with <span className="text-primary font-semibold">real-time verification</span>.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-border/50 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <FileCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-sans font-bold text-xl text-foreground">Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed font-medium">
                  Upload property documents to verify their authenticity against blockchain records. Detect any tampering
                  or modifications with <span className="text-green-600 font-semibold">cryptographic precision</span>.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-border/50 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <Map className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-sans font-bold text-xl text-foreground">Interactive Map</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed font-medium">
                  Explore land parcels on an interactive map. View boundaries, ownership information, and generate QR
                  codes for <span className="text-purple-600 font-semibold">easy sharing and verification</span>.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Land Details Modal */}
        <LandDetailsModal land={selectedLand} onClose={() => setSelectedLand(null)} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
