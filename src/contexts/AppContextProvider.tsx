import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { AppContext } from './AppContext'
import { blink, User, Server, Channel, Category } from '../lib/blink'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [servers, setServers] = useState<Server[]>([])
  const [currentServer, setCurrentServer] = useState<Server | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const refreshServers = useCallback(async () => {
    if (!user) return
    
    try {
      const userServers = await blink.db.serverMembers.list({
        where: { userId: user.id },
        orderBy: { joinedAt: 'asc' }
      })

      const serverIds = userServers.map(member => member.serverId)
      if (serverIds.length === 0) {
        setServers([])
        return
      }

      const serversData = await blink.db.servers.list({
        where: { 
          OR: serverIds.map(id => ({ id }))
        },
        orderBy: { createdAt: 'asc' }
      })

      setServers(serversData)
      
      // Set first server as current if none selected
      if (!currentServer && serversData.length > 0) {
        setCurrentServer(serversData[0])
      }
    } catch (error) {
      console.error('Failed to load servers:', error)
    }
  }, [user, currentServer, setCurrentServer])

  const refreshChannels = useCallback(async () => {
    if (!currentServer) return

    try {
      const [channelsData, categoriesData] = await Promise.all([
        blink.db.channels.list({
          where: { serverId: currentServer.id },
          orderBy: { position: 'asc' }
        }),
        blink.db.categories.list({
          where: { serverId: currentServer.id },
          orderBy: { position: 'asc' }
        })
      ])

      setChannels(channelsData)
      setCategories(categoriesData)

      // Set first text channel as current if none selected
      if (!currentChannel) {
        const firstTextChannel = channelsData.find(ch => ch.type === 'text')
        if (firstTextChannel) {
          setCurrentChannel(firstTextChannel)
        }
      }
    } catch (error) {
      console.error('Failed to load channels:', error)
    }
  }, [currentServer, currentChannel, setCurrentChannel])

  // Load user's servers when authenticated
  useEffect(() => {
    if (user && !isLoading) {
      refreshServers()
    }
  }, [user, isLoading, refreshServers])

  // Load channels when server changes
  useEffect(() => {
    if (currentServer) {
      refreshChannels()
    } else {
      setChannels([])
      setCategories([])
      setCurrentChannel(null)
    }
  }, [currentServer, refreshChannels])

  const createServer = async (name: string, description?: string, isPublic = false): Promise<Server> => {
    if (!user) throw new Error('User not authenticated')

    const serverId = `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const server = await blink.db.servers.create({
      id: serverId,
      name,
      description,
      ownerId: user.id,
      isPublic,
      createdAt: new Date().toISOString()
    })

    // Add user as owner member
    await blink.db.serverMembers.create({
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      serverId,
      userId: user.id,
      role: 'owner',
      joinedAt: new Date().toISOString()
    })

    // Create default channels
    const generalCategoryId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await blink.db.categories.create({
      id: generalCategoryId,
      serverId,
      name: 'ТЕКСТОВЫЕ КАНАЛЫ',
      position: 0,
      createdAt: new Date().toISOString()
    })

    const voiceCategoryId = `category_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`
    await blink.db.categories.create({
      id: voiceCategoryId,
      serverId,
      name: 'ГОЛОСОВЫЕ КАНАЛЫ',
      position: 1,
      createdAt: new Date().toISOString()
    })

    // Create default text channel
    await blink.db.channels.create({
      id: `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      serverId,
      categoryId: generalCategoryId,
      name: 'общий',
      type: 'text',
      position: 0,
      createdAt: new Date().toISOString()
    })

    // Create default voice channel
    await blink.db.channels.create({
      id: `channel_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`,
      serverId,
      categoryId: voiceCategoryId,
      name: 'Общий',
      type: 'voice',
      position: 0,
      createdAt: new Date().toISOString()
    })

    await refreshServers()
    return server
  }

  const createChannel = async (serverId: string, name: string, type: 'text' | 'voice', categoryId?: string): Promise<Channel> => {
    const channelId = `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const channel = await blink.db.channels.create({
      id: channelId,
      serverId,
      categoryId,
      name,
      type,
      position: channels.filter(ch => ch.categoryId === categoryId).length,
      createdAt: new Date().toISOString()
    })

    await refreshChannels()
    return channel
  }

  const createCategory = async (serverId: string, name: string): Promise<Category> => {
    const categoryId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const category = await blink.db.categories.create({
      id: categoryId,
      serverId,
      name: name.toUpperCase(),
      position: categories.length,
      createdAt: new Date().toISOString()
    })

    await refreshChannels()
    return category
  }

  const value = {
    user,
    isLoading,
    servers,
    currentServer,
    currentChannel,
    channels,
    categories,
    setCurrentServer,
    setCurrentChannel,
    refreshServers,
    refreshChannels,
    createServer,
    createChannel,
    createCategory
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}