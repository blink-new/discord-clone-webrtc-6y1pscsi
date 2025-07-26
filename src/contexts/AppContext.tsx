import { createContext } from 'react'
import { User, Server, Channel, Category } from '../lib/blink'

export interface AppContextType {
  user: User | null
  isLoading: boolean
  servers: Server[]
  currentServer: Server | null
  currentChannel: Channel | null
  channels: Channel[]
  categories: Category[]
  setCurrentServer: (server: Server | null) => void
  setCurrentChannel: (channel: Channel | null) => void
  refreshServers: () => Promise<void>
  refreshChannels: () => Promise<void>
  createServer: (name: string, description?: string, isPublic?: boolean) => Promise<Server>
  createChannel: (serverId: string, name: string, type: 'text' | 'voice', categoryId?: string) => Promise<Channel>
  createCategory: (serverId: string, name: string) => Promise<Category>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)