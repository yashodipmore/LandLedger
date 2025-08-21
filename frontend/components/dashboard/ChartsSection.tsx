"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { BarChart3, PieChartIcon, TrendingUp } from "lucide-react"
import type { DashboardStats } from "@/services/api"

interface ChartsSectionProps {
  stats: DashboardStats
}

const COLORS = {
  primary: "#3b82f6",      // Blue
  secondary: "#8b5cf6",    // Purple  
  accent: "#06b6d4",       // Cyan
  success: "#10b981",      // Green
  warning: "#f59e0b",      // Amber
  rose: "#f43f5e",         // Rose
}

export function ChartsSection({ stats }: ChartsSectionProps) {
  return (
    <div className="space-y-8">
      {/* Enhanced Bar Chart - Monthly Registrations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Land Registrations Over Time</span>
            </CardTitle>
            <CardDescription className="font-medium">Monthly registration trends showing system growth and adoption</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                count: {
                  label: "Registrations",
                  color: COLORS.primary,
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRegistrations} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent className="bg-white border shadow-lg rounded-lg" />} 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)" 
                    radius={[6, 6, 0, 0]}
                    stroke={COLORS.primary}
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Pie Chart - Ownership Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">Ownership Distribution</span>
              </CardTitle>
              <CardDescription className="font-medium">Property ownership breakdown by entity type</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer
                config={{
                  Individual: {
                    label: "Individual",
                    color: COLORS.primary,
                  },
                  Corporate: {
                    label: "Corporate",
                    color: COLORS.secondary,
                  },
                  Government: {
                    label: "Government",
                    color: COLORS.accent,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="pieGradient1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="pieGradient2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="pieGradient3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <Pie
                      data={stats.ownershipDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {stats.ownershipDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pieGradient${index + 1})`}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-white border shadow-lg rounded-lg" />} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Line Chart - Transfers Per Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">Transfer Activity</span>
              </CardTitle>
              <CardDescription className="font-medium">Monthly property transfer trends and patterns</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer
                config={{
                  transfers: {
                    label: "Transfers",
                    color: COLORS.success,
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.transfersPerMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.success} stopOpacity={0.3}/>
                        <stop offset="100%" stopColor={COLORS.success} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-white border shadow-lg rounded-lg" />} 
                    />
                    <Line
                      type="monotone"
                      dataKey="transfers"
                      stroke={COLORS.success}
                      strokeWidth={3}
                      dot={{ fill: COLORS.success, strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: COLORS.success, strokeWidth: 2, fill: '#fff' }}
                      fill="url(#lineGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
