"use client"

import { motion } from "framer-motion"
import { Building } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-muted/50 via-background to-primary/5 py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50 mt-16">
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
            <div className="mt-3 pt-3 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80 font-medium">
                Developed by <span className="text-primary font-semibold">Team Sarthak</span>
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-1">
                <span className="text-xs text-muted-foreground/70">Yashodip More</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground/70">Komal Kumavat</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground/70">Sejal Sonar</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground/70">Chinmay Chavan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
