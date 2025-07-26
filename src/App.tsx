import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import VideoRoom from './components/video/VideoRoom'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden discord-darker">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/room/:roomId" element={<VideoRoom />} />
        </Routes>
      </Router>
      <Toaster theme="dark" />
    </div>
  )
}

export default App