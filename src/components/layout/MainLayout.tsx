import { useState } from 'react'
import ServerSidebar from './ServerSidebar'
import ChannelSidebar from './ChannelSidebar'
import ChatArea from './ChatArea'
import UserBar from './UserBar'

const MainLayout = () => {
  const [selectedServer, setSelectedServer] = useState('general')
  const [selectedChannel, setSelectedChannel] = useState('general')

  return (
    <div className="flex h-screen w-screen">
      {/* Server Sidebar */}
      <ServerSidebar 
        selectedServer={selectedServer}
        onServerSelect={setSelectedServer}
      />
      
      {/* Channel Sidebar */}
      <ChannelSidebar 
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea selectedChannel={selectedChannel} />
        <UserBar />
      </div>
    </div>
  )
}

export default MainLayout