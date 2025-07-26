import { useState } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Plus, Home } from 'lucide-react'

interface ServerSidebarProps {
  selectedServer: string
  onServerSelect: (serverId: string) => void
}

const ServerSidebar = ({ selectedServer, onServerSelect }: ServerSidebarProps) => {
  const servers = [
    { id: 'home', name: 'Home', avatar: null, icon: Home },
    { id: 'general', name: 'General Server', avatar: 'G', color: 'bg-blue-600' },
    { id: 'gaming', name: 'Gaming Hub', avatar: 'GH', color: 'bg-green-600' },
    { id: 'dev', name: 'Dev Community', avatar: 'DC', color: 'bg-purple-600' },
  ]

  return (
    <div className="w-[72px] discord-darker flex flex-col items-center py-3 space-y-2">
      <TooltipProvider>
        {servers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`
                  w-12 h-12 rounded-2xl transition-all duration-200 hover:rounded-xl
                  ${selectedServer === server.id 
                    ? 'rounded-xl bg-primary text-primary-foreground' 
                    : 'hover:bg-primary/10'
                  }
                `}
                onClick={() => onServerSelect(server.id)}
              >
                {server.id === 'home' ? (
                  <Home className="w-6 h-6" />
                ) : (
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${server.color} text-white font-semibold`}>
                      {server.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black text-white">
              {server.name}
            </TooltipContent>
          </Tooltip>
        ))}
        
        {/* Add Server Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-2xl hover:rounded-xl hover:bg-green-600 transition-all duration-200 border-2 border-dashed border-muted-foreground/30 hover:border-green-600"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black text-white">
            Add a Server
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Server indicator */}
      {selectedServer !== 'home' && (
        <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full transition-all duration-200" 
             style={{ top: `${(servers.findIndex(s => s.id === selectedServer) * 56) + 20}px` }} />
      )}
    </div>
  )
}

export default ServerSidebar