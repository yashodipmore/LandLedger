import QRCode from "qrcode"

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: "#1e3a8a", // Primary color
        light: "#ffffff",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

export const calculateHash = (data: string): string => {
  // Simple hash function for demo purposes
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatWalletAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const validateWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const generateLandId = (): string => {
  const prefix = "LD"
  const number = Math.floor(Math.random() * 9999) + 1
  return `${prefix}${number.toString().padStart(4, "0")}`
}

export const generateMapBounds = (lands: any[]): [[number, number], [number, number]] => {
  if (lands.length === 0)
    return [
      [-74.01, 40.71],
      [-74.0, 40.72],
    ]

  const lats = lands.map((land) => Number.parseFloat(land.coordinates.split(",")[0]))
  const lngs = lands.map((land) => Number.parseFloat(land.coordinates.split(",")[1]))

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
}

export const parseCoordinates = (coordString: string): [number, number] => {
  const [lat, lng] = coordString.split(",").map((coord) => Number.parseFloat(coord.trim()))
  return [lat || 40.7128, lng || -74.006] // Default to NYC if parsing fails
}

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

export const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const [lat1, lng1] = coord1
  const [lat2, lng2] = coord2

  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
