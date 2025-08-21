"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { StatsOverview } from "@/components/dashboard/StatsOverview"
import { ChartsSection } from "@/components/dashboard/ChartsSection"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart, TrendingUp, Activity, Loader2 } from "lucide-react"
import { getDashboardStats, type DashboardStats } from "@/services/api"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-blue-500 to-purple-500 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl"></div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Loading Analytics Dashboard</h2>
          <p className="text-muted-foreground">Fetching real-time insights...</p>
        </motion.div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Advanced Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.01)_1px,transparent_1px)] bg-[size:200px_200px]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-green-500/20 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-sans font-bold text-4xl sm:text-5xl text-foreground tracking-tight mb-4">
            Analytics <span className="text-primary">Dashboard</span>
          </h1>
          <p className="font-medium text-lg text-primary/80 tracking-wide mb-2">
            Real-time Land Registry Insights
          </p>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Comprehensive insights into land registry operations, ownership patterns, and 
            <span className="text-primary font-semibold"> blockchain performance metrics</span>.
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl p-8 mb-8"
        >
          <StatsOverview stats={stats} />
        </motion.div>

        {/* Advanced Main Content */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Tabs defaultValue="charts" className="space-y-8">
            {/* Enhanced Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/80 backdrop-blur-sm shadow-xl border border-border/50 p-1">
                <TabsTrigger 
                  value="charts" 
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white font-medium transition-all duration-300 rounded-lg"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Charts & Analytics</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-medium transition-all duration-300 rounded-lg"
                >
                  <Activity className="h-4 w-4" />
                  <span>Activity Feed</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Enhanced Charts Tab */}
            <TabsContent value="charts" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl p-8"
              >
                <ChartsSection stats={stats} />
              </motion.div>
            </TabsContent>

            {/* Enhanced Activity Tab */}
            <TabsContent value="activity" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl p-8"
              >
                <ActivityFeed />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Enhanced Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-border/50 bg-white/60 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 h-full overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-500 to-cyan-500"></div>
              <CardHeader className="space-y-4 pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-sans font-bold text-xl text-foreground">System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed font-medium">
                  The land registry system is operating at <span className="text-primary font-semibold">optimal performance</span> with{" "}
                  <span className="text-blue-600 font-bold">{stats.totalLands}</span> properties registered and{" "}
                  <span className="text-green-600 font-bold">{stats.transfersCompleted}</span> successful transfers completed.
                </CardDescription>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">System Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-600 font-medium">99.9% Uptime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-border/50 bg-white/60 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 h-full overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
              <CardHeader className="space-y-4 pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-sans font-bold text-xl text-foreground">Data Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed font-medium">
                  Analytics show <span className="text-purple-600 font-semibold">healthy growth</span> in property registrations with{" "}
                  <span className="text-purple-600 font-bold">{stats.activeOwners}</span> active owners and{" "}
                  <span className="text-pink-600 font-bold">{stats.documentsVerified}</span> verified documents maintaining system integrity.
                </CardDescription>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-purple-600 font-medium">Growth Rate: +12%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-pink-600 font-medium">Data Integrity: 100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
