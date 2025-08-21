"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Clock, XCircle, Trash2, BookMarkedIcon as MarkAsUnread } from "lucide-react"
import { formatDate } from "@/utils/helpers"

interface Notification {
  id: string
  type: "success" | "pending" | "error" | "info"
  title: string
  message: string
  date: string
  read: boolean
  landId?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "pending",
    title: "Transfer Request Submitted",
    message: "Your transfer request for property LD001 has been submitted and is awaiting government approval.",
    date: "2024-03-15",
    read: false,
    landId: "LD001",
  },
  {
    id: "2",
    type: "success",
    title: "Property Registration Complete",
    message: "Your property LD002 has been successfully registered on the blockchain.",
    date: "2024-03-10",
    read: true,
    landId: "LD002",
  },
  {
    id: "3",
    type: "info",
    title: "System Maintenance Notice",
    message: "Scheduled maintenance will occur on March 20th from 2:00 AM to 4:00 AM UTC.",
    date: "2024-03-08",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Info</Badge>
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: false } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const filteredNotifications = notifications.filter((notification) => (filter === "all" ? true : !notification.read))

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Stay updated on your property transfers and system announcements</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "" : "bg-transparent"}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className={filter === "unread" ? "" : "bg-transparent"}
              >
                Unread ({unreadCount})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {filter === "unread" ? "No Unread Notifications" : "No Notifications"}
              </p>
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "All caught up! You have no unread notifications."
                  : "You'll see notifications about your property transfers and system updates here."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read ? "bg-muted/30" : "bg-background border-primary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${notification.read ? "text-muted-foreground" : ""}`}>
                              {notification.title}
                            </h4>
                            {getNotificationBadge(notification.type)}
                          </div>
                          <p className={`text-sm ${notification.read ? "text-muted-foreground" : ""}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                              {notification.landId && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.landId}
                                </Badge>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {notification.read ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsUnread(notification.id)}
                                  className="text-xs"
                                >
                                  <MarkAsUnread className="h-3 w-3 mr-1" />
                                  Mark Unread
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
