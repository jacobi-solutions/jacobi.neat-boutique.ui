import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ui.neatboutique.jacobi',
  appName: 'Loci',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: false,
      backgroundColor: "#ffffff" 
    }
  },
  cordova: {
    preferences: {
      DisableDeploy: "true"
    }
  }
};

export default config;
