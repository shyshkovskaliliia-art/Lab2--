import { useState } from 'react';
import { router } from 'expo-router';

import {
  ImageBackground,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type City = {
  name: string;
  description: string;
  image: any;
};

const cities: Record<string, City> = {
  paris: {
    name: 'Париж',
    description:
      'Париж — столиця Франції, відома своєю архітектурою та культурою.',
    image: require('../../assets/images/paris.jpg'),
  },

  tokyo: {
    name: 'Токіо',
    description:
      'Токіо — столиця Японії, відома сучасними технологіями та культурою.',
    image: require('../../assets/images/tokyo.jpg'),
  },

  newyork: {
    name: 'Нью-Йорк',
    description:
      'Нью-Йорк — велике місто США, відоме своїми хмарочосами та різноманітністю.',
    image: require('../../assets/images/newyork.jpg'),
  },

  kyiv: {
    name: 'Київ',
    description:
      'Київ — столиця України, місто з багатою історією та культурою.',
    image: require('../../assets/images/kyiv.jpg'),
  },
};

export default function HomeScreen() {
  // Місто, яке зараз вибране у dropdown
  const [selectedCity, setSelectedCity] = useState('paris');

  // Місто, інформація про яке зараз відображається
  const [displayedCity, setDisplayedCity] = useState('paris');

  // Відкритий чи закритий dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Текст повідомлення
  const [message, setMessage] = useState('');

  const currentCity = cities[displayedCity];

  // Обробник вибору міста
  const handleCitySelect = (cityKey: string) => {
    setSelectedCity(cityKey);
    setDisplayedCity(cityKey);
    setIsOpen(false);
  };

  const handleSendInApp = () => {
    if (message.trim()) {
      router.push({
        pathname: '/message' as any,
        params: {
          text: message,
        },
      });
    }
  };

  // Пересилання повідомлення в інші застосунки
  const handleShare = async () => {
    if (message.trim()) {
      await Share.share({
        message: message,
      });
    }
  };

  return (
    <ImageBackground
      source={currentCity.image}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Заголовок */}
        <Text style={styles.title}>МІСТА СВІТУ</Text>

        {/* Підпис */}
        <Text style={styles.label}>Оберіть місто:</Text>

        {/* Власний dropdown */}
        <View style={styles.dropdownContainer}>

          {/* Верхня частина dropdown */}
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setIsOpen(!isOpen)}
          >
            <Text style={styles.dropdownText}>
              {cities[selectedCity].name}
            </Text>

            <Text style={styles.arrow}>
              {isOpen ? '▲' : '▼'}
            </Text>
          </Pressable>

          {/* Список міст */}
          {isOpen && (
            <View style={styles.dropdownList}>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleCitySelect('paris')}
              >
                <Text style={styles.dropdownItemText}>Париж</Text>
              </Pressable>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleCitySelect('tokyo')}
              >
                <Text style={styles.dropdownItemText}>Токіо</Text>
              </Pressable>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleCitySelect('newyork')}
              >
                <Text style={styles.dropdownItemText}>Нью-Йорк</Text>
              </Pressable>

              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleCitySelect('kyiv')}
              >
                <Text style={styles.dropdownItemText}>Київ</Text>
              </Pressable>

            </View>
          )}
        </View>

        {/* Інформація про вибране місто */}
        <View style={styles.infoContainer}>

          <Text style={styles.cityName}>
            {currentCity.name}
          </Text>

          <Text style={styles.description}>
            {currentCity.description}
          </Text>

        </View>

        {/* ========================= */}
        {/* ПОВІДОМЛЕННЯ */}
        {/* ========================= */}

        <View style={styles.messageSection}>

          <Text style={styles.messageTitle}>
            Повідомлення
          </Text>

          <Text style={styles.messageLabel}>
            Введіть повідомлення:
          </Text>

          {/* Поле для введення повідомлення */}
          <TextInput
            style={styles.messageInput}
            placeholder="Напишіть повідомлення..."
            placeholderTextColor="#888888"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {/* Кнопка для передачі повідомлення в цьому застосунку */}
          <Pressable
            style={styles.sendButton}
            onPress={handleSendInApp}
          >
            <Text style={styles.sendButtonText}>
              Переслати в застосунку
            </Text>
          </Pressable>

          {/* Кнопка для передачі повідомлення іншим застосункам */}
          <Pressable
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>
              Поділитися з іншими додатками
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  backgroundImage: {
    resizeMode: 'cover',
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
    color: '#000000',
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
  },

  /* Контейнер dropdown */
  dropdownContainer: {
    marginBottom: 25,
  },

  /* Кнопка, яка відкриває список */
  dropdownButton: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 15,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Назва вибраного міста */
  dropdownText: {
    fontSize: 18,
    color: '#000000',
  },

  /* Стрілка */
  arrow: {
    fontSize: 18,
    color: '#000000',
  },

  /* Випадаючий список */
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },

  /* Один елемент списку */
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  /* Текст елемента */
  dropdownItemText: {
    fontSize: 18,
    color: '#000000',
  },

  /* Блок інформації */
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
  },

  cityName: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000',
  },

  description: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    color: '#000000',
  },

  /* ========================= */
  /* СТИЛІ ПОВІДОМЛЕННЯ */
  /* ========================= */

  messageSection: {
    marginTop: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
  },

  messageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },

  messageLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
  },

  /* Поле введення повідомлення */
  messageInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 15,
    fontSize: 17,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#000000',
  },

  /* Кнопка пересилання у цьому застосунку */
  sendButton: {
    backgroundColor: '#208AEF',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  /* Кнопка передачі іншим застосункам */
  shareButton: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },

  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});