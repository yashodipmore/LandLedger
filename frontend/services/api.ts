// Mock API service for LandLedger

export interface LandRecord {
  id: string
  landId: string
  owner: string
  ownerWallet: string
  coordinates: {
    lat: number
    lng: number
  }
  area: number
  ipfsHash: string
  documentHash: string
  registrationDate: string
  transferHistory: TransferRecord[]
  status: "active" | "pending_transfer" | "transferred"
}

export interface TransferRecord {
  id: string
  fromOwner: string
  toOwner: string
  date: string
  status: "pending" | "approved" | "rejected"
  officialId?: string
}

export interface DashboardStats {
  totalLands: number
  activeOwners: number
  transfersCompleted: number
  documentsVerified: number
  monthlyRegistrations: Array<{ month: string; count: number }>
  ownershipDistribution: Array<{ name: string; value: number }>
  transfersPerMonth: Array<{ month: string; transfers: number }>
}

// Mock data
const mockLands: LandRecord[] = [
  {
    id: "1",
    landId: "LD001",
    owner: "John Smith",
    ownerWallet: "0x1234567890abcdef1234567890abcdef12345678",
    coordinates: { lat: 40.7128, lng: -74.006 },
    area: 1000,
    ipfsHash: "QmX1Y2Z3...",
    documentHash: "abc123def456...",
    registrationDate: "2024-01-15",
    transferHistory: [],
    status: "active",
  },
  {
    id: "2",
    landId: "LD002",
    owner: "Jane Doe",
    ownerWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    area: 1500,
    ipfsHash: "QmA1B2C3...",
    documentHash: "def456ghi789...",
    registrationDate: "2024-02-20",
    transferHistory: [],
    status: "active",
  },
]

const mockTransfers: TransferRecord[] = [
  {
    id: "1",
    fromOwner: "Alice Johnson",
    toOwner: "Bob Wilson",
    date: "2024-03-01",
    status: "pending",
  },
]

// API functions
export const searchLand = async (query: string): Promise<LandRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockLands.filter(
    (land) =>
      land.landId.toLowerCase().includes(query.toLowerCase()) || land.owner.toLowerCase().includes(query.toLowerCase()),
  )
}

export const getLandDetails = async (landId: string): Promise<LandRecord | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockLands.find((land) => land.landId === landId) || null
}

export const registerLand = async (data: Partial<LandRecord>): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newLand: LandRecord = {
    id: String(mockLands.length + 1),
    landId: data.landId || `LD${String(mockLands.length + 1).padStart(3, "0")}`,
    owner: data.owner || "",
    ownerWallet: data.ownerWallet || "",
    coordinates: data.coordinates || { lat: 0, lng: 0 },
    area: data.area || 0,
    ipfsHash: `QmX${Math.random().toString(36).substr(2, 9)}`,
    documentHash: Math.random().toString(36).substr(2, 15),
    registrationDate: new Date().toISOString().split("T")[0],
    transferHistory: [],
    status: "active",
  }
  mockLands.push(newLand)
  return true
}

export const transferLand = async (landId: string, newOwner: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const land = mockLands.find((l) => l.landId === landId)
  if (land) {
    land.status = "pending_transfer"
    const transfer: TransferRecord = {
      id: String(mockTransfers.length + 1),
      fromOwner: land.owner,
      toOwner: newOwner,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }
    mockTransfers.push(transfer)
    land.transferHistory.push(transfer)
  }
  return true
}

export const approveTransfer = async (transferId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const transfer = mockTransfers.find((t) => t.id === transferId)
  if (transfer) {
    transfer.status = "approved"
    const land = mockLands.find((l) => l.transferHistory.some((t) => t.id === transferId))
    if (land) {
      land.owner = transfer.toOwner
      land.status = "active"
    }
  }
  return true
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    totalLands: mockLands.length,
    activeOwners: new Set(mockLands.map((l) => l.owner)).size,
    transfersCompleted: mockTransfers.filter((t) => t.status === "approved").length,
    documentsVerified: mockLands.length,
    monthlyRegistrations: [
      { month: "Jan", count: 12 },
      { month: "Feb", count: 19 },
      { month: "Mar", count: 15 },
      { month: "Apr", count: 22 },
      { month: "May", count: 18 },
      { month: "Jun", count: 25 },
    ],
    ownershipDistribution: [
      { name: "Individual", value: 65 },
      { name: "Corporate", value: 25 },
      { name: "Government", value: 10 },
    ],
    transfersPerMonth: [
      { month: "Jan", transfers: 5 },
      { month: "Feb", transfers: 8 },
      { month: "Mar", transfers: 12 },
      { month: "Apr", transfers: 7 },
      { month: "May", transfers: 15 },
      { month: "Jun", transfers: 10 },
    ],
  }
}

export const verifyDocument = async (file: File): Promise<{ isValid: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  // Mock verification - randomly return valid/invalid
  const isValid = Math.random() > 0.3
  return {
    isValid,
    message: isValid
      ? "Document hash matches blockchain record. Document is authentic."
      : "Document hash does not match blockchain record. Document may have been tampered with.",
  }
}

export const getPendingTransfers = async (): Promise<TransferRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockTransfers.filter((t) => t.status === "pending")
}

export const getOwnerProperties = async (ownerWallet: string): Promise<LandRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockLands.filter((land) => land.ownerWallet === ownerWallet)
}
