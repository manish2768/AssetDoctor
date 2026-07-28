import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.assetdoctor.app',
  appName: 'AssetDoctor',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
