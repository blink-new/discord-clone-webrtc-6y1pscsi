import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { useApp } from '../../hooks/useAppContext'
import { Loader2 } from 'lucide-react'

interface CreateServerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({ open, onOpenChange }) => {
  const { createServer } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await createServer(name.trim(), description.trim() || undefined, isPublic)
      setName('')
      setDescription('')
      setIsPublic(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create server:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-discord-secondary border-discord-border">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Создать сервер
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server-name" className="text-discord-text-secondary text-sm font-medium">
              НАЗВАНИЕ СЕРВЕРА *
            </Label>
            <Input
              id="server-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Мой крутой сервер"
              className="bg-discord-dark border-discord-border text-white placeholder:text-discord-text-muted"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-description" className="text-discord-text-secondary text-sm font-medium">
              ОПИСАНИЕ СЕРВЕРА
            </Label>
            <Textarea
              id="server-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о своем сервере..."
              className="bg-discord-dark border-discord-border text-white placeholder:text-discord-text-muted resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-discord-text-secondary text-sm font-medium">
                ПУБЛИЧНЫЙ СЕРВЕР
              </Label>
              <p className="text-xs text-discord-text-muted">
                Разрешить другим пользователям находить и присоединяться к серверу
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="data-[state=checked]:bg-discord-primary"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-discord-text-secondary hover:text-white hover:bg-discord-dark"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="bg-discord-primary hover:bg-discord-primary/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                'Создать сервер'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}