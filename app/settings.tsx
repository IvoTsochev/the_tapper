import { View, Text, Switch, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [haptics, setHaptics] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF' }
    ]}>
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' }
      ]}>
        Settings
      </Text>
      
      <View style={styles.settingsContainer}>
        <View style={[
          styles.card,
          { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6' }
        ]}>
          <View style={styles.setting}>
            <Text style={[
              styles.settingText,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' }
            ]}>
              Haptic Feedback
            </Text>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={haptics ? '#2563eb' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.setting}>
            <Text style={[
              styles.settingText,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' }
            ]}>
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
        
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {}}
        >
          <Text style={styles.resetButtonText}>
            Reset All Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingsContainer: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resetButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});