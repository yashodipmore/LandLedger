"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWeb3Context } from "./Web3Context"

export type UserRole = "citizen" | "official" | "owner" | null

interface User {
  walletAddress: string
  role: UserRole
  name?: string
}

interface AuthContextType {
  user: User | null
  setUserRole: (role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const web3Context = useWeb3Context()
  
  const { account, isConnected } = web3Context || { account: null, isConnected: false }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (isConnected && account) {
      // Check if user already has a role stored
      const storedRole = localStorage.getItem(`landledger_role_${account}`)
      if (storedRole) {
        setUser({
          walletAddress: account,
          role: storedRole as UserRole,
          name: `User ${account.substring(0, 6)}...${account.substring(38)}`
        })
      } else {
        // New wallet connection - needs role selection
        setUser({
          walletAddress: account,
          role: null,
          name: `User ${account.substring(0, 6)}...${account.substring(38)}`
        })
      }
    } else {
      // Wallet disconnected
      setUser(null)
    }
  }, [account, isConnected, mounted])

  const setUserRole = (role: UserRole) => {
    if (user && account) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem(`landledger_role_${account}`, role || '')
    }
  }

  const logout = () => {
    if (account) {
      localStorage.removeItem(`landledger_role_${account}`)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserRole,
        logout,
        isAuthenticated: isConnected && !!user?.role,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
