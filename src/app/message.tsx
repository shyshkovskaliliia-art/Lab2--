import { useLocalSearchParams } from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function MessageScreen() {
  const { text } = useLocalSearchParams<{ text: string }>();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Надіслане повідомлення
      </Text>

      <View style={styles.messageContainer}>

        <Text style={styles.messageLabel}>
          Ваше повідомлення:
        </Text>

        <Text style={styles.message}>
          {text || 'Повідомлення відсутнє'}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000000',
  },

  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },

  messageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555555',
  },

  message: {
    fontSize: 18,
    lineHeight: 26,
    color: '#000000',
  },
});