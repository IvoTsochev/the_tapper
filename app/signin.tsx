import { signIn } from '@/lib/supabase';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useColorScheme,
  Alert,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import useGlobalStore from '@/stores/useGlobalStore';

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const { setIsLogged } = useGlobalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const signInHandler = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Грешка', 'Моля попълнете всички полета.');
    }

    setIsSubmitting(true);

    try {
      const { error, data } = await signIn(form.email, form.password);
      if (error) {
        throw new Error('Грешка при влизането, опитайтее отново', error);
      }

      setIsLogged(true);

      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' },
        ]}
      >
        Welcome Back
      </Text>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          keyboardType="email-address"
          onChangeText={(text) => setForm({ ...form, email: text })}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
            },
          ]}
          placeholder="Password"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          secureTextEntry
          onChangeText={(text) => setForm({ ...form, password: text })}
        />

        <Pressable
          style={styles.button}
          onPress={signInHandler}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Loading...' : 'Sign In'}
          </Text>
        </Pressable>
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
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
