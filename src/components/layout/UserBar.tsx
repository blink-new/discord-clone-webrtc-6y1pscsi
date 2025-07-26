import React from 'react'
import { useApp } from '../../hooks/useAppContext'
import { blink } from '../../lib/blink'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Mic, MicOff, Headphones, Settings, LogOut } from 'lucide-react'

export const UserBar: React.FC = () => {
  const { user } = useApp()

  const handleLogout = () => {
    blink.auth.logout()
  }

  if (!user) return null

  return (
    <div className="h-[52px] bg-discord-darker px-2 flex items-center justify-between border-t border-discord-border">
      {/* User Info */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
          <AvatarFallback className="bg-discord-primary text-white text-sm">
            {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-white truncate">
              {user.displayName || user.email.split('@')[0]}
            </p>
            <Badge 
              variant="secondary" 
              className="bg-discord-accent/20 text-discord-accent border-0 text-xs px-1.5 py-0.5"
            >
              В сети
            </Badge>
          </div>
          <p className="text-xs text-discord-text-muted truncate">
            #{user.id.slice(-4)}
          </p>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-discord-text-secondary hover:text-white hover:bg-discord-dark"
        >
          <Mic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-discord-text-secondary hover:text-white hover:bg-discord-dark"
        >
          <Headphones className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-discord-text-secondary hover:text-white hover:bg-discord-dark"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-8 w-8 text-discord-text-secondary hover:text-red-400 hover:bg-discord-dark"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default UserBar