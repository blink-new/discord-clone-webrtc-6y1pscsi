import { useState } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Mic, 
  MicOff, 
  Headphones, 
  HeadphonesIcon,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react'

const UserBar = () => {
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  
  const user = {
    name: 'You',
    avatar: 'Y',
    status: 'online',
    activity: 'Building Discord Clone'
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (isDeafened) setIsDeafened(false) // Undeafen when unmuting
  }

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened)
    if (!isDeafened) setIsMuted(true) // Mute when deafening
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
    <div className="h-[52px] discord-darker flex items-center justify-between px-2 border-t border-black/20">
      {/* User Info */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className="relative">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-discord-darker ${getStatusColor(user.status)}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold discord-text truncate">{user.name}</div>
          <div className="text-xs discord-text-muted truncate">{user.activity}</div>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className={`w-8 h-8 ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-muted'}`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4 discord-text-muted" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`w-8 h-8 ${isDeafened ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-muted'}`}
          onClick={toggleDeafen}
        >
          {isDeafened ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Headphones className="w-4 h-4 discord-text-muted" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 hover:bg-muted"
        >
          <Settings className="w-4 h-4 discord-text-muted" />
        </Button>
      </div>
    </div>
  )
}

export default UserBar