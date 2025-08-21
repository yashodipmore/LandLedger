"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LandDetailsModal } from "@/components/citizen/LandDetailsModal"
import { QRCodeModal } from "@/components/citizen/QRCodeModal"
import { Eye, QrCode, ExternalLink, MapPin, Loader2 } from "lucide-react"
import { formatWalletAddress } from "@/utils/helpers"
import type { LandRecord } from "@/services/api"

interface SearchResultsProps {
  results: LandRecord[]
  isLoading: boolean
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const [selectedLand, setSelectedLand] = useState<LandRecord | null>(null)
  const [qrCodeLand, setQrCodeLand] = useState<LandRecord | null>(null)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching land records...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No search results yet. Enter a Land ID or owner name to search.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {results.length} land record(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Land ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {results.map((land, index) => (
                      <motion.tr
                        key={land.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{land.landId}</TableCell>
                        <TableCell>{land.owner}</TableCell>
                        <TableCell className="font-mono text-sm">{formatWalletAddress(land.ownerWallet)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {land.coordinates.lat.toFixed(4)}, {land.coordinates.lng.toFixed(4)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              land.status === "active"
                                ? "default"
                                : land.status === "pending_transfer"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {land.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLand(land)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQrCodeLand(land)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <QrCode className="h-4 w-4 mr-1" />
                              QR Code
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`https://ipfs.io/ipfs/${land.ipfsHash}`, "_blank")}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              IPFS
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

      {/* Modals */}
      <LandDetailsModal land={selectedLand} onClose={() => setSelectedLand(null)} />
      <QRCodeModal land={qrCodeLand} onClose={() => setQrCodeLand(null)} />
    </>
  )
}
