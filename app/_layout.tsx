import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          drawerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          },
          drawerActiveTintColor: '#3B82F6',
          drawerInactiveTintColor:
            colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: '',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="finger-print" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="signup"
          options={{
            title: 'Sign Up',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-add" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="signin"
          options={{
            title: 'Sign In',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="log-in" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="trophy" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
