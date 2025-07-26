import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../../hooks/useAppContext'
import { blink, Message } from '../../lib/blink'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Hash, Volume2, Send, Loader2 } from 'lucide-react'

export const ChatArea: React.FC = () => {
  const { user, currentChannel, currentServer } = useApp()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = useCallback(async () => {
    if (!currentChannel) return

    setIsLoading(true)
    try {
      const channelMessages = await blink.db.messages.list({
        where: { channelId: currentChannel.id },
        orderBy: { createdAt: 'asc' },
        limit: 100
      })
      setMessages(channelMessages)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentChannel])

  useEffect(() => {
    if (currentChannel) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [currentChannel, loadMessages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannel || !user) return

    setIsSending(true)
    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const message = await blink.db.messages.create({
        id: messageId,
        channelId: currentChannel.id,
        userId: user.id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString()
      })

      setMessages(prev => [...prev, message])
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера'
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    }
  }

  if (!currentChannel) {
    return (
      <div className="flex-1 bg-discord-primary flex items-center justify-center">
        <div className="text-center">
          <Hash className="h-16 w-16 text-discord-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Добро пожаловать в Discord!
          </h3>
          <p className="text-discord-text-secondary">
            Выберите канал, чтобы начать общение
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-discord-primary">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center border-b border-discord-border shadow-sm">
        <div className="flex items-center">
          {currentChannel.type === 'text' ? (
            <Hash className="h-5 w-5 text-discord-text-muted mr-2" />
          ) : (
            <Volume2 className="h-5 w-5 text-discord-text-muted mr-2" />
          )}
          <h3 className="font-semibold text-white">{currentChannel.name}</h3>
        </div>
        {currentChannel.description && (
          <>
            <div className="w-px h-6 bg-discord-border mx-3" />
            <p className="text-sm text-discord-text-secondary truncate">
              {currentChannel.description}
            </p>
          </>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-discord-text-muted" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Hash className="h-16 w-16 text-discord-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Добро пожаловать в #{currentChannel.name}!
              </h3>
              <p className="text-discord-text-secondary">
                Это начало канала #{currentChannel.name}.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1]
              const showDateSeparator = !prevMessage || 
                new Date(message.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString()
              
              const showUserInfo = !prevMessage || 
                prevMessage.userId !== message.userId ||
                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex items-center my-6">
                      <div className="flex-1 h-px bg-discord-border" />
                      <div className="px-4 py-1 bg-discord-secondary rounded text-xs text-discord-text-muted font-medium">
                        {formatDate(message.createdAt)}
                      </div>
                      <div className="flex-1 h-px bg-discord-border" />
                    </div>
                  )}
                  
                  <div className={`flex ${showUserInfo ? 'mt-4' : 'mt-0.5'}`}>
                    {showUserInfo ? (
                      <>
                        <Avatar className="h-10 w-10 mr-4 flex-shrink-0">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`} />
                          <AvatarFallback className="bg-discord-primary text-white">
                            {message.userId.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline space-x-2 mb-1">
                            <span className="font-medium text-white">
                              {message.userId === user?.id ? 'Вы' : `Пользователь ${message.userId.slice(-4)}`}
                            </span>
                            <span className="text-xs text-discord-text-muted">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-discord-text-primary break-words">
                            {message.content}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="ml-14 flex-1 min-w-0">
                        <p className="text-discord-text-primary break-words">
                          {message.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Написать в #${currentChannel.name}`}
              className="bg-discord-dark border-0 text-white placeholder:text-discord-text-muted pr-12"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() || isSending}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-transparent hover:bg-discord-primary text-discord-text-muted hover:text-white"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatArea