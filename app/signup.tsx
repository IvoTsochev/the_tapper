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
import { isValidEmail } from '@/utils/helpers/isValidEmail';
import { checkEmailExists, checkUsernameExists, signUp } from '@/lib/supabase';
import useGlobalStore from '@/stores/useGlobalStore';

export default function SignUpScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { setIsLogged } = useGlobalStore();

  const colorScheme = useColorScheme();

  const signUpHandler = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Грешка', 'Моля попълнете всички полета.');
      return;
    }

    if (!isValidEmail(form.email)) {
      Alert.alert('Грешка', 'Моля въведете валиден имейл адрес.');
      return;
    }

    setIsSubmitting(true);

    try {
      const doesUsernameExist = await checkUsernameExists(form.username);
      const doesEmailExist = await checkEmailExists(form.email);

      if (doesUsernameExist.length > 0) {
        Alert.alert('Упс', 'Потребителското име вече съществува.');
        return;
      }

      if (doesEmailExist.length > 0) {
        Alert.alert('Упс', 'Имейл адресът вече съществува.');
        return;
      }

      const { error, user } = await signUp(
        form.username,
        form.email,
        form.password
      );

      if (error) {
        throw error;
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
        Create Account
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
          placeholder="Username"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          onChangeText={(text) => setForm({ ...form, username: text })}
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

        <Pressable style={styles.button} onPress={signUpHandler}>
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Loading...' : 'Sign Up'}
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
