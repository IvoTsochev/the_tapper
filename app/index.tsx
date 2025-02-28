import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import useGlobalStore from '@/stores/useGlobalStore';
import { resetTaps, updateLeaderboardTaps } from '@/lib/supabase';

const TAP_COUNT_KEY = '@tapper:tapCount';
const { width, height } = Dimensions.get('window');

const LEVELS = [
  { requirement: 100, color: '#3B82F6' }, // Blue
  { requirement: 200, color: '#10B981' }, // Green
  { requirement: 500, color: '#8B5CF6' }, // Purple
  { requirement: 1000, color: '#F59E0B' }, // Yellow
  { requirement: 2000, color: '#EF4444' }, // Red
];

const TapRipple = ({ x, y, onFinish }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(1.2, { duration: 100 }),
      withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
    opacity.value = withTiming(0, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x - 50,
    top: y - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle} />;
};

const ProgressBar = ({ progress, color }) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <Animated.View
        style={[styles.progressBar, { backgroundColor: color }, progressStyle]}
      />
    </View>
  );
};

export default function TapScreen() {
  const [tapCount, setTapCount] = useState(0);
  const [ripples, setRipples] = useState([]);
  const counterScale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const tapAreaRef = useRef(null);

  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  const { userSession } = useGlobalStore();

  const userId = userSession?.userId || userSession?.user?.id;

  const currentLevel = LEVELS.findIndex(
    (level) => tapCount < level.requirement
  );
  const currentLevelIndex =
    currentLevel === -1 ? LEVELS.length - 1 : currentLevel;
  const previousRequirement =
    currentLevelIndex > 0 ? LEVELS[currentLevelIndex - 1].requirement : 0;
  const levelProgress =
    (tapCount - previousRequirement) /
    (LEVELS[currentLevelIndex].requirement - previousRequirement);

  useEffect(() => {
    loadTapCount();
  }, []);

  const loadTapCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem(TAP_COUNT_KEY);
      if (savedCount) {
        setTapCount(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error loading tap count:', error);
    }
  };

  const saveTapCount = async (count: number) => {
    try {
      await AsyncStorage.setItem(TAP_COUNT_KEY, count.toString());

      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }

      updateTimeout.current = setTimeout(async () => {
        if (userId) {
          await updateLeaderboardTaps(count, userId);
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving tap count:', error);
    }
  };

  const handleTap = async (event) => {
    const { pageX, pageY } = event.nativeEvent;
    tapAreaRef.current.measure(
      (x, y, width, height, pageXOffset, pageYOffset) => {
        const rippleX = pageX - pageXOffset;
        const rippleY = pageY - pageYOffset;

        const newCount = tapCount + 1;
        setTapCount(newCount);
        saveTapCount(newCount);

        // Add ripple effect
        const rippleId = Date.now();
        setRipples((current) => [
          ...current,
          { id: rippleId, x: rippleX, y: rippleY },
        ]);

        // Check for level up
        const previousLevel = LEVELS.findIndex(
          (level) => tapCount < level.requirement
        );
        const newLevel = LEVELS.findIndex(
          (level) => newCount < level.requirement
        );

        if (
          previousLevel !== newLevel ||
          newCount === LEVELS[previousLevel]?.requirement
        ) {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          counterScale.value = withSequence(
            withSpring(1.5, { damping: 10, stiffness: 200 }),
            withSpring(1, { damping: 10, stiffness: 200 })
          );
        } else {
          // Normal tap feedback
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          counterScale.value = withSequence(
            withSpring(1.2, { damping: 10, stiffness: 200 }),
            withSpring(1, { damping: 10, stiffness: 200 })
          );
        }
      }
    );
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset Tap Count',
      'Are you sure you want to reset your tap count?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setTapCount(0);
            saveTapCount(0);
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }
            await resetTaps(userId);
          },
        },
      ]
    );
  };

  const removeRipple = (id) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  };

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF' },
      ]}
    >
      <View style={styles.levelInfo}>
        <Text
          style={[
            styles.levelText,
            { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' },
          ]}
        >
          Level {currentLevelIndex + 1}
        </Text>
        <ProgressBar
          progress={levelProgress}
          color={LEVELS[currentLevelIndex].color}
        />
        <Text
          style={[
            styles.targetText,
            { color: colorScheme === 'dark' ? '#9CA3AF' : '#4B5563' },
          ]}
        >
          {tapCount} / {LEVELS[currentLevelIndex].requirement}
        </Text>
      </View>

      <TouchableOpacity
        ref={tapAreaRef}
        style={styles.tapArea}
        onPress={handleTap}
        activeOpacity={1}
      >
        {ripples.map((ripple) => (
          <TapRipple
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            onFinish={() => removeRipple(ripple.id)}
          />
        ))}

        <Animated.Text
          style={[
            styles.counter,
            { color: LEVELS[currentLevelIndex].color },
            counterAnimatedStyle,
          ]}
        >
          {tapCount.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Animated.Text>
        <Text
          style={[
            styles.tapText,
            { color: colorScheme === 'dark' ? '#9CA3AF' : '#4B5563' },
          ]}
        >
          Tap, Tap
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Ionicons name="refresh" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  levelInfo: {
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    paddingHorizontal: 16,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  targetText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  tapArea: {
    flex: 1,
    alignItems: 'center',
  },
  counter: {
    fontSize: 96,
    fontWeight: '800',
    marginTop: height * 0.15,
    fontFamily: Platform.select({
      ios: 'Helvetica Neue',
      android: 'sans-serif-condensed',
      default: 'system-ui',
    }),
    letterSpacing: -2,
  },
  tapText: {
    fontSize: 24,
    transform: [{ rotate: '-5deg' }],
    fontWeight: '600',
    marginTop: 8,
    fontStyle: 'italic',
  },
  resetButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 9999,
  },
});
