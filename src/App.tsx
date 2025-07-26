import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContextProvider'
import { AuthGuard } from './components/auth/AuthGuard'
import { MainLayout } from './components/layout/MainLayout'
import { ServerDiscovery } from './components/discovery/ServerDiscovery'
import { CreateServerModal } from './components/modals/CreateServerModal'
import VideoRoom from './components/video/VideoRoom'
import { Toaster } from 'sonner'

function App() {
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showCreateServer, setShowCreateServer] = useState(false)

  return (
    <AppProvider>
      <AuthGuard>
        <div className="h-screen w-screen overflow-hidden discord-darker">
          <Router>
            <Routes>
              <Route 
                path="/" 
                element={
                  showDiscovery ? (
                    <ServerDiscovery />
                  ) : (
                    <MainLayout 
                      onShowDiscovery={() => setShowDiscovery(true)}
                      onHideDiscovery={() => setShowDiscovery(false)}
                      onShowCreateServer={() => setShowCreateServer(true)}
                    />
                  )
                } 
              />
              <Route path="/room/:roomId" element={<VideoRoom />} />
            </Routes>
          </Router>
          
          <CreateServerModal 
            open={showCreateServer}
            onOpenChange={setShowCreateServer}
          />
          
          <Toaster theme="dark" />
        </div>
      </AuthGuard>
    </AppProvider>
  )
}

export default App