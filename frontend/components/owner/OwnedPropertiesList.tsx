"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LandDetailsModal } from "@/components/citizen/LandDetailsModal"
import { QRCodeModal } from "@/components/citizen/QRCodeModal"
import { Eye, QrCode, MapPin, Calendar, Loader2, Building } from "lucide-react"
import { getOwnerProperties, type LandRecord } from "@/services/api"
import { formatDate } from "@/utils/helpers"

export function OwnedPropertiesList() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<LandRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLand, setSelectedLand] = useState<LandRecord | null>(null)
  const [qrCodeLand, setQrCodeLand] = useState<LandRecord | null>(null)

  useEffect(() => {
    loadProperties()
  }, [user])

  const loadProperties = async () => {
    if (!user?.walletAddress) return

    setIsLoading(true)
    try {
      const ownerProperties = await getOwnerProperties(user.walletAddress)
      setProperties(ownerProperties)
    } catch (error) {
      console.error("Failed to load properties:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your properties...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">No Properties Found</p>
          <p className="text-muted-foreground">
            You don't have any registered properties yet. Contact a government official to register your land.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>My Properties</span>
            </CardTitle>
            <CardDescription>
              You own {properties.length} registered propert{properties.length === 1 ? "y" : "ies"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Land ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {properties.map((property, index) => (
                      <motion.tr
                        key={property.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group"
                      >
                        <TableCell className="font-medium font-mono">{property.landId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{property.area.toLocaleString()} sq ft</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(property.registrationDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              property.status === "active"
                                ? "default"
                                : property.status === "pending_transfer"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {property.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLand(property)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQrCodeLand(property)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <QrCode className="h-4 w-4 mr-1" />
                              QR Code
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Property Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <Building className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Area</p>
                <p className="text-2xl font-bold">{properties.reduce((sum, p) => sum + p.area, 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">sq ft</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Properties</p>
                <p className="text-2xl font-bold">{properties.filter((p) => p.status === "active").length}</p>
              </div>
              <Badge variant="default" className="h-8 px-3">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <LandDetailsModal land={selectedLand} onClose={() => setSelectedLand(null)} />
      <QRCodeModal land={qrCodeLand} onClose={() => setQrCodeLand(null)} />
    </>
  )
}
