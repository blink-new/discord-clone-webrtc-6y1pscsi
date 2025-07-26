import React, { useState, useEffect } from 'react'
import { blink, Server } from '../../lib/blink'
import { useApp } from '../../hooks/useAppContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Search, Users, Globe, Lock, Loader2 } from 'lucide-react'

export const ServerDiscovery: React.FC = () => {
  const { user, refreshServers } = useApp()
  const [publicServers, setPublicServers] = useState<Server[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [joiningServers, setJoiningServers] = useState<Set<string>>(new Set())

  const loadPublicServers = async () => {
    try {
      const servers = await blink.db.servers.list({
        where: { isPublic: "1" }, // SQLite boolean as string
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      setPublicServers(servers)
    } catch (error) {
      console.error('Failed to load public servers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPublicServers()
  }, [])

  const joinServer = async (serverId: string) => {
    if (!user) return

    setJoiningServers(prev => new Set(prev).add(serverId))
    try {
      // Check if already a member
      const existingMember = await blink.db.serverMembers.list({
        where: { 
          AND: [
            { serverId },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      if (existingMember.length === 0) {
        await blink.db.serverMembers.create({
          id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          serverId,
          userId: user.id,
          role: 'member',
          joinedAt: new Date().toISOString()
        })
        
        await refreshServers()
      }
    } catch (error) {
      console.error('Failed to join server:', error)
    } finally {
      setJoiningServers(prev => {
        const newSet = new Set(prev)
        newSet.delete(serverId)
        return newSet
      })
    }
  }

  const filteredServers = publicServers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (server.description && server.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="flex-1 bg-discord-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-discord-primary mx-auto mb-4" />
          <p className="text-discord-text-secondary">Загрузка серверов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-discord-secondary">
      {/* Header */}
      <div className="border-b border-discord-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <Globe className="h-6 w-6 text-discord-primary" />
            <h1 className="text-2xl font-bold text-white">Путешествия</h1>
          </div>
          <p className="text-discord-text-secondary mb-4">
            Найдите новые сообщества и присоединитесь к ним
          </p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-text-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск серверов..."
              className="pl-10 bg-discord-dark border-discord-border text-white placeholder:text-discord-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {filteredServers.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-discord-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery ? 'Серверы не найдены' : 'Пока нет публичных серверов'}
              </h3>
              <p className="text-discord-text-secondary">
                {searchQuery 
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Создайте первый публичный сервер!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers.map((server) => (
                <Card key={server.id} className="bg-discord-dark border-discord-border hover:border-discord-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg font-semibold truncate">
                          {server.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="bg-discord-primary/20 text-discord-primary border-0">
                            <Globe className="h-3 w-3 mr-1" />
                            Публичный
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {server.description && (
                      <CardDescription className="text-discord-text-secondary text-sm mb-4 line-clamp-3">
                        {server.description}
                      </CardDescription>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-discord-text-muted text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Участники</span>
                      </div>
                      
                      <Button
                        onClick={() => joinServer(server.id)}
                        disabled={joiningServers.has(server.id)}
                        size="sm"
                        className="bg-discord-primary hover:bg-discord-primary/90 text-white"
                      >
                        {joiningServers.has(server.id) ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Вступление...
                          </>
                        ) : (
                          'Присоединиться'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}