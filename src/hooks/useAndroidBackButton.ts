import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface UseAndroidBackButtonOptions {
  isOverlayOpen: boolean
  onCloseOverlay: () => void
}

export function useAndroidBackButton({
  isOverlayOpen,
  onCloseOverlay,
}: UseAndroidBackButtonOptions) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = App.addListener('backButton', () => {
      if (isOverlayOpen) {
        onCloseOverlay()
        return
      }

      if (location.pathname !== '/') {
        navigate('/')
        return
      }

      void App.exitApp()
    })

    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [isOverlayOpen, location.pathname, navigate, onCloseOverlay])
}