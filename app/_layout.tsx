import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { 
  NotoSansBengali_400Regular,
  NotoSansBengali_700Bold 
} from '@expo-google-fonts/noto-sans-bengali';
import { AppProvider } from '@/contexts/AppContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded] = useFonts({
    'NotoSansBengali-Regular': NotoSansBengali_400Regular,
    'NotoSansBengali-Bold': NotoSansBengali_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}