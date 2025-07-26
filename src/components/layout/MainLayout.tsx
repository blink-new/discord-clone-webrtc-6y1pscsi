import React from 'react'
import { ServerSidebar } from './ServerSidebar'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatArea } from './ChatArea'
import { UserBar } from './UserBar'

interface MainLayoutProps {
  onShowDiscovery: () => void
  onHideDiscovery: () => void
  onShowCreateServer: () => void
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  onShowDiscovery, 
  onHideDiscovery, 
  onShowCreateServer 
}) => {
  return (
    <div className="flex h-screen w-screen">
      {/* Server Sidebar */}
      <ServerSidebar 
        onShowDiscovery={onShowDiscovery}
        onShowCreateServer={onShowCreateServer}
      />
      
      {/* Channel Sidebar */}
      <ChannelSidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea />
        <UserBar />
      </div>
    </div>
  )
}

export default MainLayout