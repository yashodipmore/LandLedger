"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Wallet, FileText, ExternalLink, Clock } from "lucide-react"
import { formatDate, formatWalletAddress } from "@/utils/helpers"
import type { LandRecord } from "@/services/api"

interface LandDetailsModalProps {
  land: LandRecord | null
  onClose: () => void
}

export function LandDetailsModal({ land, onClose }: LandDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(!!land)
  }, [land])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  if (!land) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Land Details - {land.landId}</span>
          </DialogTitle>
          <DialogDescription>Complete information about this land parcel</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Land ID:</span>
                    <span className="font-mono">{land.landId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Owner:</span>
                    <span>{land.owner}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Wallet:</span>
                    <span className="font-mono text-sm">{formatWalletAddress(land.ownerWallet)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Coordinates:</span>
                    <span className="font-mono text-sm">
                      {land.coordinates.lat.toFixed(6)}, {land.coordinates.lng.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Registered:</span>
                    <span>{formatDate(land.registrationDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">IPFS Document Hash:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://ipfs.io/ipfs/${land.ipfsHash}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on IPFS
                  </Button>
                </div>
                <p className="font-mono text-sm bg-muted p-2 rounded break-all">{land.ipfsHash}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Document Hash:</span>
                <p className="font-mono text-sm bg-muted p-2 rounded break-all">{land.documentHash}</p>
              </div>
            </CardContent>
          </Card>

          {/* Transfer History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ownership History</CardTitle>
              <CardDescription>Timeline of ownership transfers and changes</CardDescription>
            </CardHeader>
            <CardContent>
              {land.transferHistory.length > 0 ? (
                <div className="space-y-4">
                  {land.transferHistory.map((transfer, index) => (
                    <motion.div
                      key={transfer.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            Transfer from {transfer.fromOwner} to {transfer.toOwner}
                          </p>
                          <Badge
                            variant={
                              transfer.status === "approved"
                                ? "default"
                                : transfer.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {transfer.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(transfer.date)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No transfer history available</p>
                  <p className="text-sm text-muted-foreground">This property has remained with the original owner</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
