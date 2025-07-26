import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'discord-clone-webrtc-6y1pscsi',
  authRequired: true
})

// Types for our Discord clone
export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  createdAt: string
}

export interface Server {
  id: string
  name: string
  description?: string
  icon?: string
  ownerId: string
  createdAt: string
  memberCount?: number
  isPublic: boolean
}

export interface Channel {
  id: string
  serverId: string
  name: string
  type: 'text' | 'voice'
  description?: string
  position: number
  categoryId?: string
  createdAt: string
}

export interface Category {
  id: string
  serverId: string
  name: string
  position: number
  createdAt: string
}

export interface Message {
  id: string
  channelId: string
  userId: string
  content: string
  createdAt: string
  editedAt?: string
}

export interface ServerMember {
  id: string
  serverId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}