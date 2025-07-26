import { useState } from 'react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Hash, 
  Volume2, 
  Settings, 
  UserPlus, 
  ChevronDown,
  ChevronRight,
  Video,
  Mic,
  MicOff,
  Headphones
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ChannelSidebarProps {
  selectedChannel: string
  onChannelSelect: (channelId: string) => void
}

const ChannelSidebar = ({ selectedChannel, onChannelSelect }: ChannelSidebarProps) => {
  const navigate = useNavigate()
  const [expandedCategories, setExpandedCategories] = useState(['text', 'voice'])
  
  const textChannels = [
    { id: 'general', name: 'general', unread: false },
    { id: 'random', name: 'random', unread: true },
    { id: 'announcements', name: 'announcements', unread: false },
    { id: 'dev-chat', name: 'dev-chat', unread: false },
  ]
  
  const voiceChannels = [
    { id: 'general-voice', name: 'General', users: 3 },
    { id: 'gaming', name: 'Gaming', users: 0 },
    { id: 'music', name: 'Music', users: 1 },
    { id: 'study-room', name: 'Study Room', users: 0 },
  ]
  
  const onlineUsers = [
    { id: '1', name: 'Alice', status: 'online', activity: 'Playing Valorant' },
    { id: '2', name: 'Bob', status: 'idle', activity: null },
    { id: '3', name: 'Charlie', status: 'dnd', activity: 'In a meeting' },
    { id: '4', name: 'Diana', status: 'online', activity: 'Listening to Spotify' },
  ]

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const joinVoiceChannel = (channelId: string) => {
    navigate(`/room/${channelId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'status-online'
      case 'idle': return 'status-idle'
      case 'dnd': return 'status-dnd'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-60 discord-dark flex flex-col">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-black/20 shadow-sm">
        <h2 className="font-semibold discord-text">General Server</h2>
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 discord-scrollbar">
        <div className="p-2">
          {/* Text Channels */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-1 py-1 h-6 text-xs font-semibold discord-text-muted hover:discord-text"
              onClick={() => toggleCategory('text')}
            >
              {expandedCategories.includes('text') ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              TEXT CHANNELS
            </Button>
            
            {expandedCategories.includes('text') && (
              <div className="mt-1 space-y-0.5">
                {textChannels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    size="sm"
                    className={`
                      w-full justify-start px-2 py-1 h-8 text-sm font-medium
                      ${selectedChannel === channel.id 
                        ? 'bg-muted discord-text' 
                        : 'discord-text-muted hover:discord-text hover:bg-muted/50'
                      }
                    `}
                    onClick={() => onChannelSelect(channel.id)}
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    {channel.name}
                    {channel.unread && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Channels */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-1 py-1 h-6 text-xs font-semibold discord-text-muted hover:discord-text"
              onClick={() => toggleCategory('voice')}
            >
              {expandedCategories.includes('voice') ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              VOICE CHANNELS
            </Button>
            
            {expandedCategories.includes('voice') && (
              <div className="mt-1 space-y-0.5">
                {voiceChannels.map((channel) => (
                  <div key={channel.id}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-2 py-1 h-8 text-sm font-medium discord-text-muted hover:discord-text hover:bg-muted/50"
                      onClick={() => joinVoiceChannel(channel.id)}
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {channel.name}
                      {channel.users > 0 && (
                        <span className="ml-auto text-xs">{channel.users}</span>
                      )}
                    </Button>
                    
                    {/* Show users in voice channel */}
                    {channel.users > 0 && (
                      <div className="ml-6 space-y-1">
                        {Array.from({ length: channel.users }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-2 px-2 py-1">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">U{i+1}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs discord-text-muted">User {i+1}</span>
                            <div className="ml-auto flex space-x-1">
                              <Mic className="w-3 h-3 discord-text-muted" />
                              <Headphones className="w-3 h-3 discord-text-muted" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4 bg-black/20" />

          {/* Online Users */}
          <div>
            <div className="px-1 py-1 text-xs font-semibold discord-text-muted">
              ONLINE — {onlineUsers.length}
            </div>
            <div className="mt-2 space-y-1">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-muted/30 cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-discord-dark ${getStatusColor(user.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium discord-text truncate">{user.name}</div>
                    {user.activity && (
                      <div className="text-xs discord-text-muted truncate">{user.activity}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ChannelSidebar