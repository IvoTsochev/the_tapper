import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  useColorScheme,
  Appearance,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [haptics, setHaptics] = useState(true);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as 'light' | 'dark' | 'system');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
    Appearance.setColorScheme(newTheme);
  };

  const currentTheme = theme === 'system' ? colorScheme : theme;

  return (
    <View
      className={`flex-1 p-6 ${
        currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <Text
        className={`text-3xl font-bold mb-6 ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Settings
      </Text>

      <View className="space-y-4">
        <View
          className={`p-4 rounded-lg ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          {/* Dark Mode Toggle */}
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-semibold ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Dark Mode
            </Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={theme === 'dark' ? '#2563eb' : '#f4f3f4'}
            />
          </View>

          {/* Haptic Feedback Toggle */}
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-semibold ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Haptic Feedback
            </Text>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={haptics ? '#2563eb' : '#f4f3f4'}
            />
          </View>

          {/* Sound Effects Toggle */}
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-lg font-semibold ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Sound Effects
            </Text>
            <Switch
              value={sound}
              onValueChange={setSound}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={sound ? '#2563eb' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity className="bg-red-500 p-4 rounded-lg mt-4 active:bg-red-600">
          <Text className="text-white text-center font-semibold text-lg">
            Reset All Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
