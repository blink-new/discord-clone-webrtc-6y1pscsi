import { useParams, useNavigate } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  MoreVertical
} from 'lucide-react'
import { useState } from 'react'

const VideoRoom = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [showChat, setShowChat] = useState(false)
  
  const {
    peers,
    userVideo,
    userVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    connectionStatus,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    leaveRoom
  } = useWebRTC({ roomID: roomId || 'default' })

  const handleLeaveRoom = () => {
    leaveRoom()
    navigate('/')
  }

  // Mock participants for demo
  const participants = [
    { id: 'user1', name: 'Alice', avatar: 'A', isMuted: false, isVideoOn: true },
    { id: 'user2', name: 'Bob', avatar: 'B', isMuted: true, isVideoOn: true },
    { id: 'user3', name: 'Charlie', avatar: 'C', isMuted: false, isVideoOn: false },
  ]

  const getGridCols = (count: number) => {
    if (count <= 1) return 'grid-cols-1'
    if (count <= 4) return 'grid-cols-2'
    if (count <= 9) return 'grid-cols-3'
    return 'grid-cols-4'
  }

  const totalParticipants = participants.length + 1 // +1 for current user

  return (
    <div className="h-screen w-screen discord-darker flex flex-col">
      {/* Header */}
      <div className="h-14 discord-dark flex items-center justify-between px-4 border-b border-black/20">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <h2 className="font-semibold discord-text">
            {roomId?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
          <span className="text-sm discord-text-muted">
            {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="w-4 h-4 discord-text-muted" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Users className="w-4 h-4 discord-text-muted" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreVertical className="w-4 h-4 discord-text-muted" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className={`h-full grid gap-4 ${getGridCols(totalParticipants)}`}>
          {/* Current User Video */}
          <div className="relative bg-discord-dark rounded-lg overflow-hidden">
            {isVideoEnabled ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    Y
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            
            {/* User overlay */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-2">
              <div className="bg-black/70 px-2 py-1 rounded text-sm discord-text font-medium">
                You {isScreenSharing && '(Screen)'}
              </div>
              {!isAudioEnabled && (
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            {/* Connection status */}
            <div className="absolute top-3 right-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
            </div>
          </div>

          {/* Other Participants */}
          {participants.map((participant) => (
            <div key={participant.id} className="relative bg-discord-dark rounded-lg overflow-hidden">
              {participant.isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  {/* Simulated video feed */}
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-2">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                        {participant.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm discord-text-muted">Video feed simulation</div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
                      {participant.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              {/* Participant overlay */}
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <div className="bg-black/70 px-2 py-1 rounded text-sm discord-text font-medium">
                  {participant.name}
                </div>
                {participant.isMuted && (
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <MicOff className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="h-20 discord-dark flex items-center justify-center space-x-4 border-t border-black/20">
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-full ${
            !isAudioEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-discord-darker hover:bg-discord-background'
          }`}
          onClick={toggleAudio}
        >
          {isAudioEnabled ? (
            <Mic className="w-5 h-5 discord-text" />
          ) : (
            <MicOff className="w-5 h-5 text-white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-full ${
            !isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-discord-darker hover:bg-discord-background'
          }`}
          onClick={toggleVideo}
        >
          {isVideoEnabled ? (
            <Video className="w-5 h-5 discord-text" />
          ) : (
            <VideoOff className="w-5 h-5 text-white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-full ${
            isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-discord-darker hover:bg-discord-background'
          }`}
          onClick={toggleScreenShare}
        >
          {isScreenSharing ? (
            <MonitorOff className="w-5 h-5 text-white" />
          ) : (
            <Monitor className="w-5 h-5 discord-text" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-discord-darker hover:bg-discord-background">
          <Settings className="w-5 h-5 discord-text" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
          onClick={handleLeaveRoom}
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Connection Status Indicator */}
      {connectionStatus !== 'connected' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-sm discord-text">
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Connection lost'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoRoom