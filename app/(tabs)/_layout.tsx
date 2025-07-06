import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { ShoppingCart, History, Settings, Calculator } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';

export default function TabLayout() {
  const { theme, t } = useApp();
  const colors = getColors(theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          borderTopWidth: 1,
          paddingTop: Platform.OS === 'ios' ? 8 : 4,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 84 : 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'NotoSansBengali-Regular',
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('marketList'),
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('history'),
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: t('calculator'),
          tabBarIcon: ({ color, size }) => (
            <Calculator color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}