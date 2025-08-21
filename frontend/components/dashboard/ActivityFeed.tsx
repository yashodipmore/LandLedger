"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Building, ArrowRightLeft, FileCheck, User, Clock, RefreshCw } from "lucide-react"
import { formatDate } from "@/utils/helpers"

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

// Mock activity data
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "registration",
    title: "New Land Registration",
    description: "Property LD003 registered by John Smith",
    timestamp: "2024-03-15T10:30:00Z",
    landId: "LD003",
    user: "John Smith",
    status: "completed",
  },
  {
    id: "2",
    type: "transfer",
    title: "Transfer Request Submitted",
    description: "Transfer request for LD001 from Alice Johnson to Bob Wilson",
    timestamp: "2024-03-15T09:15:00Z",
    landId: "LD001",
    user: "Alice Johnson",
    status: "pending",
  },
  {
    id: "3",
    type: "approval",
    title: "Transfer Approved",
    description: "Government official approved transfer for LD002",
    timestamp: "2024-03-15T08:45:00Z",
    landId: "LD002",
    user: "Gov. Official",
    status: "approved",
  },
  {
    id: "4",
    type: "verification",
    title: "Document Verified",
    description: "Property document for LD001 successfully verified",
    timestamp: "2024-03-15T08:00:00Z",
    landId: "LD001",
    status: "completed",
  },
  {
    id: "5",
    type: "registration",
    title: "New Land Registration",
    description: "Property LD004 registered by Sarah Davis",
    timestamp: "2024-03-14T16:20:00Z",
    landId: "LD004",
    user: "Sarah Davis",
    status: "completed",
  },
  {
    id: "6",
    type: "transfer",
    title: "Transfer Completed",
    description: "Ownership of LD005 transferred to Michael Brown",
    timestamp: "2024-03-14T14:10:00Z",
    landId: "LD005",
    user: "Michael Brown",
    status: "completed",
  },
]

export function ActivityFeed() {
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest system activities and transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {mockActivities.map((activity, index) => (
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
                        {activity.status && getStatusBadge(activity.status)}
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(activity.timestamp)}</span>
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
                      {activity.user && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{activity.user}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          <div className="text-center mt-6">
            <Button variant="outline" className="bg-transparent">
              Load More Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
