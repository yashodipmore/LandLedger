"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { StatsOverview } from "@/components/dashboard/StatsOverview"
import { ChartsSection } from "@/components/dashboard/ChartsSection"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard analytics...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    )
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
          <h1 className="font-serif font-bold text-4xl text-foreground mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive insights into land registry operations, ownership patterns, and system performance.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsOverview stats={stats} />
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="charts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
              <TabsTrigger value="charts" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Charts & Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Activity Feed</span>
              </TabsTrigger>
            </TabsList>

            {/* Charts Tab */}
            <TabsContent value="charts" className="space-y-6">
              <ChartsSection stats={stats} />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <ActivityFeed />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-border">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="font-serif text-lg">System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                The land registry system is operating at optimal performance with {stats.totalLands} properties
                registered and {stats.transfersCompleted} successful transfers completed to date.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <PieChart className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="font-serif text-lg">Data Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Analytics show healthy growth in property registrations with {stats.activeOwners} active property owners
                and {stats.documentsVerified} verified documents maintaining system integrity.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
