import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans, Poppins } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import { Web3Provider } from "@/context/Web3Context"
import { Navbar } from "@/components/layout/Navbar"
import ChatBot from "@/components/chatbot/ChatBot"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "LandLedger - Blockchain Land Registry",
  description: "Transparent, tamper-proof land registry system built on blockchain technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${workSans.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans">
        <Web3Provider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
              {/* AI Chatbot - Available on all pages */}
              <ChatBot />
            </div>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
