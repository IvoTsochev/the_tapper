import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

export default function SignInScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF' }
    ]}>
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#FFFFFF' : '#111827' }
      ]}>
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
            }
          ]}
          placeholder="Email"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          keyboardType="email-address"
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F3F4F6',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
            }
          ]}
          placeholder="Password"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Sign In
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