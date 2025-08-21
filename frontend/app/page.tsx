"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Building, Search, FileCheck, BarChart3 } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  transition: { type: "spring", stiffness: 300 },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">LandLedger</h1>
            <p className="font-serif text-xl sm:text-2xl text-primary mb-4">Transparent, Tamper-Proof Land Registry</p>
          </motion.div>

          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure your property rights with blockchain technology. Our decentralized land registry system ensures
            transparency, prevents fraud, and provides immutable proof of ownership.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/citizen">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Go to Citizen Portal
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  <Shield className="mr-2 h-5 w-5" />
                  Login as Official
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Building className="mr-2 h-5 w-5" />
                  Login as Owner
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Why Choose LandLedger?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on blockchain technology to provide the most secure and transparent land registry system available.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} {...scaleOnHover}>
              <Card className="border-border hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="font-serif">Tamper-Proof Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    All land records are stored on blockchain, making them immutable and resistant to fraud or
                    unauthorized changes.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} {...scaleOnHover}>
              <Card className="border-border hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <FileCheck className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle className="font-serif">Document Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Instantly verify the authenticity of land documents using cryptographic hashes and IPFS storage.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} {...scaleOnHover}>
              <Card className="border-border hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <Users className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-serif">Multi-Portal Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Separate portals for citizens, property owners, and government officials with role-based access
                    control.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} {...scaleOnHover}>
              <Card className="border-border hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <Search className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="font-serif">Easy Property Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Search for land records by property ID, owner name, or location with instant results and detailed
                    information.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} {...scaleOnHover}>
              <Card className="border-border hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <Building className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle className="font-serif">Smart Transfers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Streamlined property transfer process with automated workflows and government approval tracking.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} {...scaleOnHover}>
              <Card className="border-border hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-serif">Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive analytics and reporting for government officials to track registrations, transfers,
                    and system usage.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust LandLedger for secure property management.
          </p>
          <Link href="/citizen">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg">Start Exploring Properties</Button>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-serif font-bold text-lg">LandLedger</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LandLedger. Built with blockchain technology for a transparent future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
