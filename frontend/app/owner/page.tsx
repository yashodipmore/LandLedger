"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { OwnedPropertiesList } from "@/components/owner/OwnedPropertiesList"
import { TransferLandForm } from "@/components/owner/TransferLandForm"
import { NotificationCenter } from "@/components/owner/NotificationCenter"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, ArrowRightLeft, Bell, Info } from "lucide-react"

export default function OwnerPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "owner") {
      router.push("/auth")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "owner") {
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
            <Building className="h-8 w-8 text-secondary" />
            <h1 className="font-serif font-bold text-4xl text-foreground">Property Owner Portal</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your property portfolio and initiate secure ownership transfers on the blockchain.
          </p>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-semibold text-xl mb-2">Welcome back, {user?.name}!</h2>
                  <p className="text-muted-foreground">
                    Wallet: <span className="font-mono text-sm">{user?.walletAddress}</span>
                  </p>
                </div>
                <Building className="h-12 w-12 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[500px] mx-auto">
              <TabsTrigger value="properties" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>My Properties</span>
              </TabsTrigger>
              <TabsTrigger value="transfer" className="flex items-center space-x-2">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Transfer</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6">
              <OwnedPropertiesList />
            </TabsContent>

            {/* Transfer Tab */}
            <TabsContent value="transfer" className="space-y-6">
              <TransferLandForm />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <NotificationCenter />
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
              <Building className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="font-serif text-lg">Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View all your registered properties with complete ownership details, coordinates, and blockchain
                verification status.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <ArrowRightLeft className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">Secure Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Initiate property transfers to new owners with blockchain security. All transfers require government
                approval for legal compliance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <Bell className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="font-serif text-lg">Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Stay informed about transfer status, approval notifications, and important updates regarding your
                properties.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-800">Blockchain Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700">
                All property transfers are secured by blockchain technology and require government approval. Once
                approved, ownership changes are permanent and cannot be reversed. Please ensure all transfer details are
                correct before submission.
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
