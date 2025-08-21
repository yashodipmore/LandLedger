"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { RegisterLandForm } from "@/components/official/RegisterLandForm"
import { TransferApprovalTable } from "@/components/official/TransferApprovalTable"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileText, CheckSquare, AlertTriangle } from "lucide-react"

export default function OfficialPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "official") {
      router.push("/auth")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "official") {
    return null
  }

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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-serif font-bold text-4xl text-foreground">Government Official Portal</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Register new land parcels and manage property transfer approvals with blockchain security.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="register" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
              <TabsTrigger value="register" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Register Land</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center space-x-2">
                <CheckSquare className="h-4 w-4" />
                <span>Approve Transfers</span>
              </TabsTrigger>
            </TabsList>

            {/* Register Land Tab */}
            <TabsContent value="register" className="space-y-6">
              <RegisterLandForm />
            </TabsContent>

            {/* Transfer Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <TransferApprovalTable />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-border">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">Land Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Register new land parcels on the blockchain with complete ownership details, coordinates, and document
                verification. All registrations are immutable and tamper-proof.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CheckSquare className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="font-serif text-lg">Transfer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Review and approve property transfer requests from owners. Ensure all legal requirements are met before
                finalizing ownership changes on the blockchain.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* Warning Card */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Important Notice</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700">
                All actions performed in this portal are recorded on the blockchain and cannot be reversed. Please
                verify all information carefully before submitting registrations or approving transfers.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
