import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DUMMY_DATA = [
  { id: '1', username: 'TapMaster', score: 12543 },
  { id: '2', username: 'SpeedTapper', score: 10232 },
  { id: '3', username: 'TapChamp', score: 9876 },
  { id: '4', username: 'QuickFinger', score: 8765 },
  { id: '5', username: 'TapKing', score: 7654 },
];

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme();

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.itemContainer,
      { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6' }
    ]}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.username,
          { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' }
        ]}>
          {item.username}
        </Text>
        <Text style={[
          styles.score,
          { color: colorScheme === 'dark' ? '#9CA3AF' : '#4B5563' }
        ]}>
          {item.score.toLocaleString()} taps
        </Text>
      </View>
      
      {index === 0 && (
        <Ionicons name="trophy" size={24} color="#FFD700" />
      )}
    </View>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF' }
    ]}>
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' }
      ]}>
        Top Tappers
      </Text>
      
      <FlatList
        data={DUMMY_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  list: {
    gap: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  score: {
    fontSize: 14,
  },
});