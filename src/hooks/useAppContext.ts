import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}