import { View, Text, useColorScheme } from 'react-native';
import React from 'react';
import useGlobalStore from '@/stores/useGlobalStore';

const Profile = () => {
  const { userData } = useGlobalStore();
  console.log('userData', userData);
  const { username, email } = userData || {};
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View className={`flex-1 p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Text
        className={`text-3xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Profile
      </Text>

      <View
        className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      >
        {/* Username */}
        <View className="mb-4">
          <Text
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Username
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {username || 'N/A'}
          </Text>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Email
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {email || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;
