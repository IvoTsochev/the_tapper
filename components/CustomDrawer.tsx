import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase-config';
import useGlobalStore from '@/stores/useGlobalStore';
import { useNavigation } from 'expo-router';
import { signOut } from '@/lib/supabase';
import { router } from 'expo-router';

export default function CustomDrawer(props: any) {
  const { userSession, setUserSession, setIsLogged, setUserData } =
    useGlobalStore();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

  const handleLogout = async () => {
    Alert.alert('Изход', 'Сигурни ли сте, че искате да излезете?', [
      {
        text: 'Отказ',
        style: 'cancel',
      },
      {
        text: 'Изход',
        onPress: async () => {
          await signOut();
          setUserSession(null);
          setIsLogged(false);
          setUserData(null);
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: isDarkMode ? '#111827' : '#FFFFFF' }}
    >
      <View className="px-4 py-3">
        <Text
          className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          {userSession ? 'Welcome Back!' : 'Welcome!'}
        </Text>
      </View>

      {/* Always visible screens */}
      <DrawerItem
        label="Tap"
        icon={({ size }) => (
          <Ionicons
            name="finger-print"
            size={size}
            color={isDarkMode ? '#F3F4F6' : '#1F2937'}
          />
        )}
        labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
        onPress={() => navigation.navigate('index')}
      />
      <DrawerItem
        label="Profile"
        icon={({ size }) => (
          <Ionicons
            name="person-outline"
            size={size}
            color={isDarkMode ? '#F3F4F6' : '#1F2937'}
          />
        )}
        labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
        onPress={() => navigation.navigate('profile')}
      />
      <DrawerItem
        label="Leaderboard"
        icon={({ size }) => (
          <Ionicons
            name="trophy"
            size={size}
            color={isDarkMode ? '#F3F4F6' : '#1F2937'}
          />
        )}
        labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
        onPress={() => navigation.navigate('leaderboard')}
      />
      <DrawerItem
        label="Settings"
        icon={({ size }) => (
          <Ionicons
            name="settings"
            size={size}
            color={isDarkMode ? '#F3F4F6' : '#1F2937'}
          />
        )}
        labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
        onPress={() => navigation.navigate('settings')}
      />

      {/* Show Sign In & Sign Up ONLY when not logged in */}
      {!userSession && (
        <>
          <DrawerItem
            label="Sign In"
            icon={({ size }) => (
              <Ionicons
                name="log-in"
                size={size}
                color={isDarkMode ? '#F3F4F6' : '#1F2937'}
              />
            )}
            labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
            onPress={() => navigation.navigate('signin')}
          />
          <DrawerItem
            label="Sign Up"
            icon={({ size }) => (
              <Ionicons
                name="person-add"
                size={size}
                color={isDarkMode ? '#F3F4F6' : '#1F2937'}
              />
            )}
            labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
            onPress={() => navigation.navigate('signup')}
          />
        </>
      )}

      {/* Show logout button ONLY when logged in */}
      {userSession && (
        <DrawerItem
          label="Logout"
          icon={({ size }) => (
            <Ionicons
              name="log-out"
              size={size}
              color={isDarkMode ? '#F3F4F6' : '#1F2937'}
            />
          )}
          labelStyle={{ color: isDarkMode ? '#F3F4F6' : '#1F2937' }}
          onPress={() => {
            props.navigation.closeDrawer();
            handleLogout();
          }}
        />
      )}
    </DrawerContentScrollView>
  );
}
