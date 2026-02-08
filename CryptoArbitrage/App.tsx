import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { CryptoAsset } from './src/types';
import { useCryptoData } from './src/hooks/useCryptoData';
import PricesScreen from './src/screens/PricesScreen';
import ArbitrageScreen from './src/screens/ArbitrageScreen';
import DetailScreen from './src/screens/DetailScreen';
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Prices: '$',
    Arbitrage: '%',
  };
  return (
    <Text
      style={{
        fontSize: focused ? 20 : 16,
        fontWeight: focused ? '800' : '400',
        color: focused ? COLORS.primary : COLORS.textMuted,
      }}
    >
      {icons[label] || '?'}
    </Text>
  );
}

export default function App() {
  const { assets, opportunities, loading, refreshing, lastUpdated, refresh } =
    useCryptoData();
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  if (selectedAsset) {
    // Find latest data for this asset
    const current =
      assets.find((a) => a.id === selectedAsset.id) || selectedAsset;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <DetailScreen asset={current} onBack={() => setSelectedAsset(null)} />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.primary,
          background: COLORS.background,
          card: COLORS.card,
          text: COLORS.text,
          border: COLORS.border,
          notification: COLORS.green,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon label={route.name} focused={focused} />
          ),
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Prices">
          {() => (
            <SafeAreaView style={styles.container}>
              <PricesScreen
                assets={assets}
                loading={loading}
                refreshing={refreshing}
                lastUpdated={lastUpdated}
                onRefresh={refresh}
                onSelectAsset={setSelectedAsset}
              />
            </SafeAreaView>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Arbitrage"
          options={{
            tabBarBadge:
              opportunities.length > 0 ? opportunities.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: COLORS.green,
              color: '#fff',
              fontSize: 10,
              fontWeight: '700',
              minWidth: 18,
              height: 18,
              lineHeight: 18,
            },
          }}
        >
          {() => (
            <SafeAreaView style={styles.container}>
              <ArbitrageScreen
                opportunities={opportunities}
                loading={loading}
                refreshing={refreshing}
                lastUpdated={lastUpdated}
                onRefresh={refresh}
                onSelectAsset={setSelectedAsset}
              />
            </SafeAreaView>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
