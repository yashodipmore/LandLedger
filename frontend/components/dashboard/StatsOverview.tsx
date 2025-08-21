"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Users, ArrowRightLeft, FileCheck, TrendingUp, TrendingDown } from "lucide-react"
import type { DashboardStats } from "@/services/api"

interface StatsOverviewProps {
  stats: DashboardStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Lands Registered",
      value: stats.totalLands.toLocaleString(),
      icon: Building,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Active Owners",
      value: stats.activeOwners.toLocaleString(),
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      title: "Transfers Completed",
      value: stats.transfersCompleted.toLocaleString(),
      icon: ArrowRightLeft,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+15%",
      changeType: "increase" as const,
    },
    {
      title: "Documents Verified",
      value: stats.documentsVerified.toLocaleString(),
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
      changeType: "increase" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const ChangeIcon = stat.changeType === "increase" ? TrendingUp : TrendingDown

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      <ChangeIcon
                        className={`h-3 w-3 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                      />
                      <span
                        className={`text-xs font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
