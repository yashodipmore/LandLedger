"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Building, ArrowRightLeft, FileCheck, User, Clock, RefreshCw, Loader2 } from "lucide-react"
import { formatDate } from "@/utils/helpers"
import { getActivityFeed, type ActivityEvent } from "@/services/api"

interface ActivityItem {
  id: string
  type: "registration" | "transfer" | "verification" | "approval"
  title: string
  description: string
  timestamp: string
  landId?: string
  user?: string
  status?: "completed" | "pending" | "approved" | "rejected"
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadActivityFeed()
  }, [])

  const loadActivityFeed = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      const activityData = await getActivityFeed(10)
      setActivities(activityData)
    } catch (error) {
      console.error("Failed to load activity feed:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "registration":
        return <Building className="h-5 w-5 text-primary" />
      case "transfer":
        return <ArrowRightLeft className="h-5 w-5 text-secondary" />
      case "verification":
        return <FileCheck className="h-5 w-5 text-green-600" />
      case "approval":
        return <User className="h-5 w-5 text-accent" />
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "approved":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Approved
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return formatDate(timestamp.split("T")[0])
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading activity feed...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Blockchain Activity</span>
              </CardTitle>
              <CardDescription>Latest blockchain transactions and system events</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent"
              onClick={() => loadActivityFeed(true)}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Blockchain
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(activity.date)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center space-x-4">
                      {activity.landId && (
                        <Badge variant="outline" className="text-xs">
                          {activity.landId}
                        </Badge>
                      )}
                      {activity.userAddress && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{activity.userAddress.substring(0, 6)}...{activity.userAddress.substring(38)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {activities.length >= 10 && (
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                className="bg-transparent"
                onClick={() => loadActivityFeed()}
              >
                Load More Activities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
