"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
import { searchLand, type LandRecord } from "@/services/api"

interface SearchSectionProps {
  onSearchResults: (results: LandRecord[]) => void
  onSearchStart: () => void
  onSearchEnd: () => void
}

export function SearchSection({ onSearchResults, onSearchStart, onSearchEnd }: SearchSectionProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    onSearchStart()

    try {
      const results = await searchLand(query.trim())
      onSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      onSearchResults([])
    } finally {
      setIsLoading(false)
      onSearchEnd()
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Land Records</span>
          </CardTitle>
          <CardDescription>Enter a Land ID (e.g., LD001) or owner name to search for property records</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Land ID or Owner Name</Label>
              <div className="flex space-x-2">
                <Input
                  id="search-query"
                  type="text"
                  placeholder="Enter Land ID (e.g., LD001) or owner name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !query.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Try these sample searches:</strong>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["LD001", "LD002", "John Smith", "Jane Doe"].map((sample) => (
                <Button key={sample} variant="outline" size="sm" onClick={() => setQuery(sample)} className="text-xs">
                  {sample}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
