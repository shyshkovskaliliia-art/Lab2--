import { useState } from 'react';

import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
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

  const currentCity = cities[displayedCity];

  // Обробник вибору міста
  const handleCitySelect = (cityKey: string) => {
    setSelectedCity(cityKey);
    setDisplayedCity(cityKey);
    setIsOpen(false);
  };

  return (
    <ImageBackground
      source={currentCity.image}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>

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

      </View>
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
    flex: 1,
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

  buttonContainer: {
    marginBottom: 25,
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
});