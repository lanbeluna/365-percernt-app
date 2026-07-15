import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

function runHaptic(action: () => Promise<void>) {
  if (!Capacitor.isNativePlatform()) return

  void action().catch(() => undefined)
}

export function tapFeedback() {
  runHaptic(() => Haptics.impact({ style: ImpactStyle.Light }))
}

export function successFeedback() {
  runHaptic(() => Haptics.notification({ type: NotificationType.Success }))
}
