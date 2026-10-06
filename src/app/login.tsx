import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [login, setLogin] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    setError('');

    if (!login.trim()) {
      setError('Введіть логін');
      return;
    }

    setLoading(true);

    const result = await signIn(login);

    setLoading(false);

    if (!result.success) {
      setError(
        result.message ??
          'Помилка авторизації'
      );
      return;
    }

    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Авторизація
        </Text>

        <Text style={styles.subtitle}>
          Введіть свій логін
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Логін"
          placeholderTextColor="#888"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error !== '' && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.buttonText}>
              Увійти
            </Text>
          )}
        </Pressable>

        <Text style={styles.info}>
          Після входу сесія діє обмежений час.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#208AEF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 25,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 17,
    color: '#000000',
  },

  error: {
    color: '#D32F2F',
    marginTop: 10,
    fontSize: 15,
  },

  button: {
    backgroundColor: '#208AEF',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  info: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    lineHeight: 22,
  },
});