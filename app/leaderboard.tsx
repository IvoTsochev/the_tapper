import {
  View,
  Text,
  FlatList,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { getTop10LeaderboardData } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import LeaderboardItem from '@/components/LeaderboardItem';

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme();

  const {
    data: top10LeaderboardData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['top10LeaderboardData'],
    queryFn: getTop10LeaderboardData,
    staleTime: 1000 * 60,
  });

  if (error) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <Text
          className={`text-lg font-semibold ${
            colorScheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Ups, something went wrong. Please try again later.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View
      className={`flex-1 p-4 ${
        colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <Text
        className={`text-3xl font-bold mb-6 ${
          colorScheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Top Tappers
      </Text>

      <FlatList
        data={top10LeaderboardData}
        renderItem={({ item, index }) => (
          <LeaderboardItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
}
