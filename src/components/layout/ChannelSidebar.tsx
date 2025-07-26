import React, { useState } from 'react'
import { useApp } from '../../hooks/useAppContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Hash, 
  Volume2, 
  Settings, 
  UserPlus, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Loader2
} from 'lucide-react'

export const ChannelSidebar: React.FC = () => {
  const { 
    currentServer, 
    currentChannel, 
    setCurrentChannel, 
    channels, 
    categories,
    createChannel,
    createCategory
  } = useApp()

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text')
  const [newChannelCategory, setNewChannelCategory] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentServer || !newChannelName.trim()) return

    setIsCreating(true)
    try {
      await createChannel(
        currentServer.id,
        newChannelName.trim(),
        newChannelType,
        newChannelCategory || undefined
      )
      setNewChannelName('')
      setNewChannelType('text')
      setNewChannelCategory('')
      setShowCreateChannel(false)
    } catch (error) {
      console.error('Failed to create channel:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentServer || !newCategoryName.trim()) return

    setIsCreating(true)
    try {
      await createCategory(currentServer.id, newCategoryName.trim())
      setNewCategoryName('')
      setShowCreateCategory(false)
    } catch (error) {
      console.error('Failed to create category:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!currentServer) {
    return (
      <div className="w-60 bg-discord-secondary flex items-center justify-center">
        <p className="text-discord-text-muted text-sm">Выберите сервер</p>
      </div>
    )
  }

  // Group channels by category
  const channelsByCategory = channels.reduce((acc, channel) => {
    const categoryId = channel.categoryId || 'uncategorized'
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(channel)
    return acc
  }, {} as Record<string, typeof channels>)

  return (
    <div className="w-60 bg-discord-secondary flex flex-col">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-discord-border shadow-sm">
        <h2 className="font-semibold text-white truncate">{currentServer.name}</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-discord-text-secondary hover:text-white">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Render categories and their channels */}
        {categories.map((category) => {
          const categoryChannels = channelsByCategory[category.id] || []
          const isExpanded = expandedCategories.has(category.id)

          return (
            <div key={category.id} className="mb-4">
              {/* Category Header */}
              <div className="flex items-center justify-between group mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(category.id)}
                  className="flex-1 justify-start h-6 px-1 text-xs font-semibold text-discord-text-muted hover:text-discord-text-secondary uppercase tracking-wide"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1" />
                  )}
                  {category.name}
                </Button>
                
                <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 text-discord-text-muted hover:text-white"
                      onClick={() => setNewChannelCategory(category.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {/* Category Channels */}
              {isExpanded && (
                <div className="ml-2 space-y-0.5">
                  {categoryChannels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentChannel(channel)}
                      className={`w-full justify-start h-8 px-2 text-discord-text-secondary hover:text-white hover:bg-discord-dark ${
                        currentChannel?.id === channel.id
                          ? 'bg-discord-dark text-white'
                          : ''
                      }`}
                    >
                      {channel.type === 'text' ? (
                        <Hash className="h-4 w-4 mr-2" />
                      ) : (
                        <Volume2 className="h-4 w-4 mr-2" />
                      )}
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Uncategorized channels */}
        {channelsByCategory.uncategorized && (
          <div className="space-y-0.5">
            {channelsByCategory.uncategorized.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentChannel(channel)}
                className={`w-full justify-start h-8 px-2 text-discord-text-secondary hover:text-white hover:bg-discord-dark ${
                  currentChannel?.id === channel.id
                    ? 'bg-discord-dark text-white'
                    : ''
                }`}
              >
                {channel.type === 'text' ? (
                  <Hash className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                <span className="truncate">{channel.name}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Create Category Button */}
        <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-discord-text-muted hover:text-white mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать категорию
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Create Channel Modal */}
      <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
        <DialogContent className="bg-discord-secondary border-discord-border">
          <DialogHeader>
            <DialogTitle className="text-white">Создать канал</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-discord-text-secondary text-sm font-medium">
                ТИП КАНАЛА
              </Label>
              <Select value={newChannelType} onValueChange={(value: 'text' | 'voice') => setNewChannelType(value)}>
                <SelectTrigger className="bg-discord-dark border-discord-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-discord-dark border-discord-border">
                  <SelectItem value="text" className="text-white">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2" />
                      Текстовый канал
                    </div>
                  </SelectItem>
                  <SelectItem value="voice" className="text-white">
                    <div className="flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Голосовой канал
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-discord-text-secondary text-sm font-medium">
                НАЗВАНИЕ КАНАЛА
              </Label>
              <Input
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="новый-канал"
                className="bg-discord-dark border-discord-border text-white"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreateChannel(false)}
                className="text-discord-text-secondary hover:text-white"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!newChannelName.trim() || isCreating}
                className="bg-discord-primary hover:bg-discord-primary/90 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать канал'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Category Modal */}
      <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
        <DialogContent className="bg-discord-secondary border-discord-border">
          <DialogHeader>
            <DialogTitle className="text-white">Создать категорию</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-discord-text-secondary text-sm font-medium">
                НАЗВАНИЕ КАТЕГОРИИ
              </Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Новая категория"
                className="bg-discord-dark border-discord-border text-white"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreateCategory(false)}
                className="text-discord-text-secondary hover:text-white"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!newCategoryName.trim() || isCreating}
                className="bg-discord-primary hover:bg-discord-primary/90 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать категорию'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChannelSidebar