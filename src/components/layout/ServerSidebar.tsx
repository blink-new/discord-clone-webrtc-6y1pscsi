import React from 'react'
import { useApp } from '../../hooks/useAppContext'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Plus, Compass, Hash } from 'lucide-react'

interface ServerSidebarProps {
  onShowDiscovery: () => void
  onShowCreateServer: () => void
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({ 
  onShowDiscovery, 
  onShowCreateServer 
}) => {
  const { servers, currentServer, setCurrentServer } = useApp()

  return (
    <div className="w-[72px] bg-discord-darker flex flex-col items-center py-3 space-y-2">
      <TooltipProvider>
        {/* Home/DM Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-[24px] bg-discord-primary hover:bg-discord-primary/90 hover:rounded-[16px] transition-all duration-200 text-white"
            >
              <Hash className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black text-white">
            Личные сообщения
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="w-8 h-[2px] bg-discord-border rounded-full my-2" />

        {/* Server List */}
        {servers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentServer(server)}
                className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 text-white font-medium ${
                  currentServer?.id === server.id
                    ? 'bg-discord-primary rounded-[16px]'
                    : 'bg-discord-secondary hover:bg-discord-primary'
                }`}
              >
                {server.icon ? (
                  <img 
                    src={server.icon} 
                    alt={server.name}
                    className="w-full h-full rounded-inherit object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {server.name.charAt(0).toUpperCase()}
                  </span>
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
              onClick={onShowCreateServer}
              className="w-12 h-12 rounded-[24px] bg-discord-secondary hover:bg-discord-accent hover:rounded-[16px] transition-all duration-200 text-discord-accent hover:text-white"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black text-white">
            Добавить сервер
          </TooltipContent>
        </Tooltip>

        {/* Server Discovery Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowDiscovery}
              className="w-12 h-12 rounded-[24px] bg-discord-secondary hover:bg-discord-accent hover:rounded-[16px] transition-all duration-200 text-discord-accent hover:text-white"
            >
              <Compass className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black text-white">
            Путешествия
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default ServerSidebar