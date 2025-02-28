import { View, Text } from 'react-native';
import React from 'react';
import { LeaderboardType } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';

const LeaderboardItem = ({
  item,
  index,
}: {
  item: LeaderboardType;
  index: number;
}) => {
  return (
    <View className="flex-row items-center p-4 rounded-lg bg-gray-200 dark:bg-gray-800">
      <View className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
        <Text className="text-white font-bold">{index + 1}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold dark:text-white">
          {item.username}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {item.taps} taps
        </Text>
      </View>
      {index === 0 && <Ionicons name="trophy" size={24} color="#FFD700" />}
    </View>
  );
};

export default LeaderboardItem;
