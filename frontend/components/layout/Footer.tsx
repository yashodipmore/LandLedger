"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Mail, Phone, MapPin, Shield, FileCheck, Users, BarChart3, Github, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    products: [
      { name: "Citizen Portal", href: "/citizen" },
      { name: "Owner Portal", href: "/owner" },
      { name: "Official Portal", href: "/official" },
      { name: "Analytics Dashboard", href: "/dashboard" },
    ],
    features: [
      { name: "Property Search", href: "/citizen", icon: Users },
      { name: "Document Verification", href: "/citizen", icon: FileCheck },
      { name: "Secure Registry", href: "/", icon: Shield },
      { name: "Real-time Analytics", href: "/dashboard", icon: BarChart3 },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Government Partnerships", href: "/partnerships" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api-docs" },
      { name: "Help Center", href: "/help" },
      { name: "System Status", href: "/status" },
      { name: "Security", href: "/security" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/landledger", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/landledger", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/landledger", icon: Github },
    { name: "Instagram", href: "https://instagram.com/landledger", icon: Instagram },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-outfit font-bold text-2xl mb-4 text-white">
              Stay Updated with LandLedger
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Get the latest updates on blockchain technology, property regulations, and platform enhancements delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 font-medium px-6">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-outfit font-bold text-2xl text-white">LandLedger</h2>
                <p className="text-blue-400 text-sm font-medium">Blockchain Land Registry</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6 leading-relaxed">
              India's most trusted blockchain-based land registry platform. Securing property rights with transparent, 
              tamper-proof records powered by advanced cryptographic technology.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>contact@landledger.gov.in</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+91 11 2345 6789</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-outfit font-semibold text-lg text-white mb-6">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-outfit font-semibold text-lg text-white mb-6">Features</h3>
            <ul className="space-y-3">
              {footerLinks.features.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 py-1 group"
                    >
                      <Icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-outfit font-semibold text-lg text-white mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-outfit font-semibold text-lg text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-6">
              <p className="text-slate-400 text-sm">
                © {currentYear} LandLedger. All rights reserved.
              </p>
              <Separator orientation="vertical" className="h-4 bg-slate-600" />
              <p className="text-slate-400 text-sm">
                Government of India Initiative
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">System Status: Online</span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-slate-600" />
              <span className="text-slate-400 text-sm">
                Secured by Blockchain Technology
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
