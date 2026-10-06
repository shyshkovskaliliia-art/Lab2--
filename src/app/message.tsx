import { useLocalSearchParams } from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  isLanguage,
  translations,
  type Language,
} from '@/constants/translations';

export default function MessageScreen() {
  const params = useLocalSearchParams<{
    text?: string;
    lang?: string;
  }>();

  const rawLanguage = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;

  const language: Language =
    rawLanguage && isLanguage(rawLanguage)
      ? rawLanguage
      : 'uk';

  const rawText = Array.isArray(params.text)
    ? params.text[0]
    : params.text;

  const message = rawText ?? '';

  const t = translations[language];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t.message.sentMessage}
      </Text>

      <View style={styles.messageContainer}>
        <Text style={styles.label}>
          {t.message.yourMessage}
        </Text>

        <Text style={styles.message}>
          {message || t.message.missing}
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
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000',
  },

  message: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333333',
  },
});