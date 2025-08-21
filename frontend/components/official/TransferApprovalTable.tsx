"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConfirmationModal } from "@/components/official/ConfirmationModal"
import { CheckCircle, XCircle, Clock, Loader2, AlertTriangle } from "lucide-react"
import { getPendingTransfers, approveTransfer, type TransferRecord } from "@/services/api"
import { formatDate } from "@/utils/helpers"

export function TransferApprovalTable() {
  const [transfers, setTransfers] = useState<TransferRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    transfer: TransferRecord | null
    action: "approve" | "reject"
  }>({
    isOpen: false,
    transfer: null,
    action: "approve",
  })
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    loadPendingTransfers()
  }, [])

  const loadPendingTransfers = async () => {
    setIsLoading(true)
    try {
      const pendingTransfers = await getPendingTransfers()
      setTransfers(pendingTransfers)
    } catch (error) {
      console.error("Failed to load transfers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = (transfer: TransferRecord, action: "approve" | "reject") => {
    setConfirmModal({
      isOpen: true,
      transfer,
      action,
    })
  }

  const confirmAction = async () => {
    if (!confirmModal.transfer) return

    setProcessingId(confirmModal.transfer.id)
    setResult(null)

    try {
      if (confirmModal.action === "approve") {
        const success = await approveTransfer(confirmModal.transfer.id)
        if (success) {
          setResult({
            success: true,
            message: `Transfer from ${confirmModal.transfer.fromOwner} to ${confirmModal.transfer.toOwner} has been approved.`,
          })
          // Remove the approved transfer from the list
          setTransfers((prev) => prev.filter((t) => t.id !== confirmModal.transfer!.id))
        } else {
          setResult({
            success: false,
            message: "Failed to approve transfer. Please try again.",
          })
        }
      } else {
        // Mock reject functionality
        setResult({
          success: true,
          message: `Transfer from ${confirmModal.transfer.fromOwner} to ${confirmModal.transfer.toOwner} has been rejected.`,
        })
        setTransfers((prev) => prev.filter((t) => t.id !== confirmModal.transfer!.id))
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred. Please try again.",
      })
    } finally {
      setProcessingId(null)
      setConfirmModal({ isOpen: false, transfer: null, action: "approve" })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading pending transfers...</p>
          </div>
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
              <Clock className="h-5 w-5" />
              <span>Pending Transfer Approvals</span>
            </CardTitle>
            <CardDescription>
              Review and approve property transfer requests from owners
              {transfers.length > 0 && ` (${transfers.length} pending)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mb-6">
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>{result.message}</AlertDescription>
                </div>
              </Alert>
            )}

            {transfers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No Pending Transfers</p>
                <p className="text-muted-foreground">All transfer requests have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transfer ID</TableHead>
                      <TableHead>From Owner</TableHead>
                      <TableHead>To Owner</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {transfers.map((transfer, index) => (
                        <motion.tr
                          key={transfer.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="group"
                        >
                          <TableCell className="font-medium font-mono">{transfer.id}</TableCell>
                          <TableCell>{transfer.fromOwner}</TableCell>
                          <TableCell>{transfer.toOwner}</TableCell>
                          <TableCell>{formatDate(transfer.date)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transfer.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(transfer, "approve")}
                                disabled={processingId === transfer.id}
                                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              >
                                {processingId === transfer.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(transfer, "reject")}
                                disabled={processingId === transfer.id}
                                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, transfer: null, action: "approve" })}
        onConfirm={confirmAction}
        transfer={confirmModal.transfer}
        action={confirmModal.action}
      />
    </>
  )
}
