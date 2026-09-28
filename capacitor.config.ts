import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tradepilot.app',
  appName: 'TradePilot',
  webDir: 'dist',
  backgroundColor: '#080a10',
  android: {
    backgroundColor: '#080a10',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#080a10',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_notify',
      iconColor: '#34d399',
    },
  },
}

export default config
