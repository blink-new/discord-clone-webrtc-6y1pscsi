import { useEffect, useRef, useState, useCallback } from 'react'
import io, { Socket } from 'socket.io-client'
import Peer from 'simple-peer'

interface PeerData {
  peerID: string
  peer: Peer.Instance
}

interface UseWebRTCProps {
  roomID: string
}

export const useWebRTC = ({ roomID }: UseWebRTCProps) => {
  const [peers, setPeers] = useState<PeerData[]>([])
  const [userVideo, setUserVideo] = useState<MediaStream | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  
  const socketRef = useRef<Socket>()
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<PeerData[]>([])
  const roomIDRef = useRef(roomID)

  // Initialize socket connection
  useEffect(() => {
    // For demo purposes, we'll simulate a socket connection
    // In a real app, you'd connect to your signaling server
    console.log('Connecting to room:', roomID)
    setConnectionStatus('connected')
    
    const socket = socketRef.current
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [roomID])

  // Get user media
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        
        setUserVideo(stream)
        
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing media devices:', error)
        setConnectionStatus('disconnected')
      }
    }

    getUserMedia()

    return () => {
      // Cleanup will be handled by the leaveRoom function
    }
  }, [])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (userVideo) {
      const videoTrack = userVideo.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }, [userVideo])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (userVideo) {
      const audioTrack = userVideo.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }, [userVideo])

  // Screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        // Replace video track with screen share
        if (userVideo) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = peersRef.current.find(peer => 
            peer.peer._pc?.getSenders().find(s => s.track?.kind === 'video')
          )
          
          if (sender) {
            // In a real implementation, you'd replace the track for all peers
            console.log('Screen sharing started')
          }
        }
        
        setUserVideo(screenStream)
        setIsScreenSharing(true)
        
        // Listen for screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          // Restore camera
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
              setUserVideo(stream)
              if (userVideoRef.current) {
                userVideoRef.current.srcObject = stream
              }
            })
        }
        
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = screenStream
        }
      } else {
        // Stop screen sharing and restore camera
        if (userVideo) {
          userVideo.getTracks().forEach(track => track.stop())
        }
        
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        
        setUserVideo(cameraStream)
        setIsScreenSharing(false)
        
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = cameraStream
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
    }
  }, [isScreenSharing, userVideo])

  // Leave room
  const leaveRoom = useCallback(() => {
    if (userVideo) {
      userVideo.getTracks().forEach(track => track.stop())
    }
    
    peersRef.current.forEach(peerData => {
      peerData.peer.destroy()
    })
    
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
    
    setPeers([])
    setUserVideo(null)
    setConnectionStatus('disconnected')
  }, [userVideo])

  // For demo purposes, simulate some peers joining
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate other users joining (for demo)
      const mockPeers: PeerData[] = [
        {
          peerID: 'demo-peer-1',
          peer: {} as Peer.Instance // Mock peer for demo
        }
      ]
      setPeers(mockPeers)
      peersRef.current = mockPeers
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return {
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
  }
}