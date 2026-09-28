import { Capacitor } from '@capacitor/core'

export const isNative = Capacitor.isNativePlatform()

/** Take or pick a chart photo. On Android uses the native camera; on web falls back to a file picker via the plugin's web implementation. Returns a data URL or null if cancelled. */
export async function captureChartPhoto(): Promise<string | null> {
  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // asks: camera or gallery
      promptLabelHeader: 'Chart photo',
      promptLabelPhoto: 'From gallery',
      promptLabelPicture: 'Take photo',
    })
    return photo.dataUrl ?? null
  } catch {
    return null // user cancelled or unavailable
  }
}

/** Ask permission and schedule the daily lesson reminder (8:12 local time). Safe to call repeatedly — schedules once per day idempotently. */
export async function scheduleDailyLessonReminder(lessonTitle: string): Promise<boolean> {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const perm = await LocalNotifications.requestPermissions()
    if (perm.display !== 'granted') return false
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] })
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1001,
          title: "Today's trading lesson is ready",
          body: lessonTitle,
          schedule: {
            on: { hour: 8, minute: 12 },
            every: 'day',
            allowWhileIdle: true,
          },
          smallIcon: 'ic_stat_notify',
        },
      ],
    })
    return true
  } catch {
    return false
  }
}

export async function hapticSuccess(): Promise<void> {
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics')
    await Haptics.notification({ type: NotificationType.Success })
  } catch {
    /* web / unsupported */
  }
}

export async function hapticError(): Promise<void> {
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics')
    await Haptics.notification({ type: NotificationType.Error })
  } catch {
    /* web / unsupported */
  }
}

export async function hapticTap(): Promise<void> {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    await Haptics.impact({ style: ImpactStyle.Light })
  } catch {
    /* web / unsupported */
  }
}

/** Style the native status bar to match the terminal theme. No-op on web. */
export async function applyNativeChrome(): Promise<void> {
  if (!isNative) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#080a10' })
  } catch {
    /* ignore */
  }
}
