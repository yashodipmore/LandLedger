"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { TransferRecord } from "@/services/api"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transfer: TransferRecord | null
  action: "approve" | "reject"
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, transfer, action }: ConfirmationModalProps) {
  if (!transfer) return null

  const isApprove = action === "approve"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isApprove ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>{isApprove ? "Approve" : "Reject"} Transfer</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {action} this property transfer? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Transfer ID:</span>
              <span className="text-sm font-mono">{transfer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">From:</span>
              <span className="text-sm">{transfer.fromOwner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">To:</span>
              <span className="text-sm">{transfer.toOwner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">{transfer.date}</span>
            </div>
          </div>

          <Alert variant={isApprove ? "default" : "destructive"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isApprove
                ? "Approving this transfer will permanently change the property ownership on the blockchain."
                : "Rejecting this transfer will cancel the ownership change request and notify the current owner."}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant={isApprove ? "default" : "destructive"}
            className={isApprove ? "" : "bg-red-600 hover:bg-red-700"}
          >
            {isApprove ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Transfer
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Transfer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
