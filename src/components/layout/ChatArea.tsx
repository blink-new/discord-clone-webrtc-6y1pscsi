import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Hash, 
  Users, 
  Pin, 
  Bell, 
  Search, 
  Inbox, 
  HelpCircle,
  Smile,
  Plus,
  Gift,
  Sticker,
  Send,
  Video,
  Phone
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ChatAreaProps {
  selectedChannel: string
}

interface Message {
  id: string
  user: string
  avatar: string
  content: string
  timestamp: Date
  reactions?: { emoji: string; count: number }[]
}

const ChatArea = ({ selectedChannel }: ChatAreaProps) => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'Alice',
      avatar: 'A',
      content: 'Hey everyone! How\'s it going?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      reactions: [{ emoji: '👋', count: 3 }]
    },
    {
      id: '2',
      user: 'Bob',
      avatar: 'B',
      content: 'Pretty good! Just working on some code. Anyone want to hop on a video call?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: '3',
      user: 'Charlie',
      avatar: 'C',
      content: 'I\'m down for a video call! Let me finish this task first.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      reactions: [{ emoji: '💻', count: 1 }, { emoji: '👍', count: 2 }]
    },
    {
      id: '4',
      user: 'Diana',
      avatar: 'D',
      content: 'Same here! This WebRTC implementation is looking great 🚀',
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'Y',
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const startVideoCall = () => {
    navigate(`/room/${selectedChannel}-video`)
  }

  const startVoiceCall = () => {
    navigate(`/room/${selectedChannel}-voice`)
  }

  return (
    <div className="flex-1 flex flex-col discord-bg">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-black/20 shadow-sm">
        <div className="flex items-center space-x-3">
          <Hash className="w-5 h-5 discord-text-muted" />
          <h3 className="font-semibold discord-text">{selectedChannel}</h3>
          <div className="w-px h-6 bg-muted" />
          <p className="text-sm discord-text-muted">Welcome to #{selectedChannel}!</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={startVoiceCall}>
            <Phone className="w-4 h-4 discord-text-muted hover:discord-text" />
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={startVideoCall}>
            <Video className="w-4 h-4 discord-text-muted hover:discord-text" />
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Pin className="w-4 h-4 discord-text-muted hover:discord-text" />
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Users className="w-4 h-4 discord-text-muted hover:discord-text" />
          </Button>
          <div className="relative">
            <Input
              placeholder="Search"
              className="w-36 h-6 text-sm bg-discord-darker border-none discord-text placeholder:discord-text-muted"
            />
            <Search className="absolute right-2 top-1 w-3 h-3 discord-text-muted" />
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Inbox className="w-4 h-4 discord-text-muted hover:discord-text" />
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <HelpCircle className="w-4 h-4 discord-text-muted hover:discord-text" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 discord-scrollbar">
        <div className="p-4 space-y-4">
          {messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1].user !== message.user
            const timeDiff = index > 0 ? message.timestamp.getTime() - messages[index - 1].timestamp.getTime() : 0
            const showTimestamp = showAvatar || timeDiff > 5 * 60 * 1000 // 5 minutes

            return (
              <div key={message.id} className={`flex ${showAvatar ? 'mt-4' : 'mt-0.5'}`}>
                <div className="w-10 flex-shrink-0">
                  {showAvatar && (
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {message.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <div className="flex-1 ml-4">
                  {showAvatar && (
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="font-semibold discord-text">{message.user}</span>
                      <span className="text-xs discord-text-muted">{formatTime(message.timestamp)}</span>
                    </div>
                  )}
                  
                  <div className="discord-text leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.reactions && (
                    <div className="flex space-x-1 mt-1">
                      {message.reactions.map((reaction, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs bg-discord-darker hover:bg-discord-dark border border-discord-dark"
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4">
        <div className="relative">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${selectedChannel}`}
            className="w-full bg-discord-dark border-none discord-text placeholder:discord-text-muted pr-12 py-3 rounded-lg"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Plus className="w-4 h-4 discord-text-muted hover:discord-text" />
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Gift className="w-4 h-4 discord-text-muted hover:discord-text" />
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Sticker className="w-4 h-4 discord-text-muted hover:discord-text" />
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Smile className="w-4 h-4 discord-text-muted hover:discord-text" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-xs discord-text-muted">
          Use <kbd className="px-1 py-0.5 bg-discord-darker rounded text-xs">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  )
}

export default ChatArea