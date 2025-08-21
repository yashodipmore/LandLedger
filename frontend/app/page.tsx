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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.01)_1px,transparent_1px)] bg-[size:200px_200px]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-accent/20 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-primary/20 rounded-full animate-pulse"></div>
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 tracking-tight">
              Land<span className="text-primary">Ledger</span>
            </h1>
            <p className="font-medium text-xl sm:text-2xl text-primary mb-4 tracking-wide">
              Transparent, Tamper-Proof Land Registry
            </p>
          </motion.div>

          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure your property rights with <span className="text-primary font-semibold">blockchain technology</span>. Our decentralized land registry system ensures
            transparency, prevents fraud, and provides <span className="text-secondary font-semibold">immutable proof of ownership</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/citizen">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }} 
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg font-medium">
                  <Search className="mr-2 h-5 w-5" />
                  Go to Citizen Portal
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)" }} 
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-primary/50 hover:bg-primary/5 hover:border-primary font-medium">
                  <Shield className="mr-2 h-5 w-5" />
                  Login as Official
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)" }} 
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-lg font-medium">
                  <Building className="mr-2 h-5 w-5" />
                  Login as Owner
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/20 via-background to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="font-sans font-bold text-3xl text-foreground mb-4 tracking-tight">Why Choose LandLedger?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Built on <span className="text-primary font-semibold">blockchain technology</span> to provide the most secure and transparent land registry system available.
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
              <Card className="border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-sans font-semibold text-lg">Tamper-Proof Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    All land records are stored on blockchain, making them <span className="text-primary font-medium">immutable</span> and resistant to fraud or
                    unauthorized changes.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Card className="border-border hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mb-4">
                    <FileCheck className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="font-sans font-semibold text-lg">Document Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Instantly verify the authenticity of land documents using <span className="text-secondary font-medium">cryptographic hashes</span> and IPFS storage.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Card className="border-border hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className="p-3 bg-accent/10 rounded-full w-fit mb-4">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-sans font-semibold text-lg">Multi-Portal Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Separate portals for citizens, property owners, and government officials with <span className="text-accent font-medium">role-based access</span>
                    control.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Card className="border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-sans font-semibold text-lg">Easy Property Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Search for land records by property ID, owner name, or location with <span className="text-primary font-medium">instant results</span> and detailed
                    information.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Card className="border-border hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mb-4">
                    <Building className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="font-sans font-semibold text-lg">Smart Transfers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Streamlined property transfer process with <span className="text-secondary font-medium">automated workflows</span> and government approval tracking.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Card className="border-border hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardHeader>
                  <div className="p-3 bg-accent/10 rounded-full w-fit mb-4">
                    <BarChart3 className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-sans font-semibold text-lg">Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Comprehensive analytics and reporting for government officials to track registrations, transfers,
                    and <span className="text-accent font-medium">system usage</span>.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-sans font-bold text-3xl lg:text-4xl text-foreground mb-6 tracking-tight">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
              Join <span className="text-primary font-semibold">thousands of users</span> who trust LandLedger for secure property management.
            </p>
            <Link href="/citizen">
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="px-12 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl font-semibold">
                  Start Exploring Properties
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-muted/50 via-background to-primary/5 py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3 mb-6 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div>
                <span className="font-sans font-bold text-xl tracking-tight">
                  Land<span className="text-primary">Ledger</span>
                </span>
                <p className="text-sm text-muted-foreground font-medium">Blockchain Land Registry</p>
              </div>
            </motion.div>
            <motion.div
              className="text-center md:text-right"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                © 2025 LandLedger. Built with <span className="text-primary font-semibold">blockchain technology</span><br />
                for a transparent future.
              </p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}
