import { useEffect, useState } from 'react';

import {
  AppState,
  ImageBackground,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { testSupabaseConnection } from '@/lib/testSupabase';
import { useAuth } from '@/context/AuthContext';

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
    image: require('../../../assets/images/paris.jpg'),
  },

  tokyo: {
    name: 'Токіо',
    description:
      'Токіо — столиця Японії, відома сучасними технологіями та культурою.',
    image: require('../../../assets/images/tokyo.jpg'),
  },

  newyork: {
    name: 'Нью-Йорк',
    description:
      'Нью-Йорк — велике місто США, відоме своїми хмарочосами та різноманітністю.',
    image: require('../../../assets/images/newyork.jpg'),
  },

  kyiv: {
    name: 'Київ',
    description:
      'Київ — столиця України, місто з багатою історією та культурою.',
    image: require('../../../assets/images/kyiv.jpg'),
  },
};

type TimerState = {
  startedAt: number | null;
  elapsedMs: number;
  running: boolean;
};

const TIMER_STORAGE_KEY = 'lab3_timer_state';
const LANGUAGE_STORAGE_KEY = 'lab3_language';

export default function HomeScreen() {
  const {
    user,
    authElapsedSeconds,
    signOut,
  } = useAuth();

  /*
   * ================================
   * МІСТА
   * ================================
   */

  const [selectedCity, setSelectedCity] =
    useState('paris');

  const [displayedCity, setDisplayedCity] =
    useState('paris');

  const [isCityOpen, setIsCityOpen] =
    useState(false);

  const currentCity =
    cities[displayedCity];

  const handleCitySelect = (
    cityKey: string
  ) => {
    setSelectedCity(cityKey);
    setDisplayedCity(cityKey);
    setIsCityOpen(false);
  };

  /*
   * ================================
   * МОВА
   * ================================
   */

  const [language, setLanguage] =
    useState('uk');

  const [isLanguageOpen, setIsLanguageOpen] =
    useState(false);

  /*
   * Отримання мови пристрою
   */
  useEffect(() => {
    const deviceLanguage =
      getLocales()[0]?.languageCode;

    if (
      deviceLanguage === 'uk' ||
      deviceLanguage === 'en'
    ) {
      setLanguage(deviceLanguage);
    }
  }, []);

  /*
   * Завантаження збереженої мови
   */
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage =
          await AsyncStorage.getItem(
            LANGUAGE_STORAGE_KEY
          );

        if (
          savedLanguage === 'uk' ||
          savedLanguage === 'en'
        ) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.log(
          '🔴 Помилка завантаження мови:',
          error
        );
      }
    };

    loadLanguage();
  }, []);

  /*
   * Збереження мови
   */
  const handleLanguageSelect = async (
    value: string
  ) => {
    setLanguage(value);
    setIsLanguageOpen(false);

    try {
      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        value
      );
    } catch (error) {
      console.log(
        '🔴 Помилка збереження мови:',
        error
      );
    }
  };

  /*
   * ================================
   * ЗВИЧАЙНИЙ ТАЙМЕР LAB 4
   * ================================
   */

  const [timerState, setTimerState] =
    useState<TimerState>({
      startedAt: null,
      elapsedMs: 0,
      running: false,
    });

  /*
   * Завантаження стану таймера
   */
  useEffect(() => {
    const loadTimer = async () => {
      try {
        const saved =
          await AsyncStorage.getItem(
            TIMER_STORAGE_KEY
          );

        if (saved) {
          const parsed: TimerState =
            JSON.parse(saved);

          setTimerState(parsed);
        }
      } catch (error) {
        console.log(
          '🔴 Помилка завантаження таймера:',
          error
        );
      }
    };

    loadTimer();
  }, []);

  /*
   * Збереження стану таймера
   */
  useEffect(() => {
    const saveTimer = async () => {
      try {
        await AsyncStorage.setItem(
          TIMER_STORAGE_KEY,
          JSON.stringify(timerState)
        );
      } catch (error) {
        console.log(
          '🔴 Помилка збереження таймера:',
          error
        );
      }
    };

    saveTimer();
  }, [timerState]);

  /*
   * Оновлення звичайного таймера
   */
  useEffect(() => {
    if (!timerState.running) {
      return;
    }

    const interval = setInterval(() => {
      setTimerState((previous) => {
        if (!previous.running) {
          return previous;
        }

        const startedAt =
          previous.startedAt ?? Date.now();

        return {
          ...previous,
          elapsedMs:
            Date.now() - startedAt,
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timerState.running]);

  /*
   * Робота таймера після повернення
   * програми на передній план
   */
  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        (nextState) => {
          if (
            nextState === 'active' &&
            timerState.running
          ) {
            setTimerState(
              (previous) => {
                if (
                  !previous.running
                ) {
                  return previous;
                }

                const startedAt =
                  previous.startedAt ??
                  Date.now();

                return {
                  ...previous,
                  elapsedMs:
                    Date.now() -
                    startedAt,
                };
              }
            );
          }
        }
      );

    return () => {
      subscription.remove();
    };
  }, [timerState.running]);

  /*
   * Запуск звичайного таймера
   */
  const startTimer = () => {
    setTimerState((previous) => ({
      ...previous,
      startedAt:
        previous.startedAt ??
        Date.now(),
      running: true,
    }));
  };

  /*
   * Пауза звичайного таймера
   */
  const pauseTimer = () => {
    setTimerState((previous) => ({
      ...previous,
      elapsedMs:
        previous.startedAt
          ? Date.now() -
            previous.startedAt
          : previous.elapsedMs,
      running: false,
    }));
  };

  /*
   * Скидання звичайного таймера
   */
  const resetTimer = async () => {
    const newState: TimerState = {
      startedAt: null,
      elapsedMs: 0,
      running: false,
    };

    setTimerState(newState);

    try {
      await AsyncStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(newState)
      );
    } catch (error) {
      console.log(
        '🔴 Помилка скидання таймера:',
        error
      );
    }
  };

  /*
   * Форматування звичайного таймера
   */
  const formatTimer = (
    milliseconds: number
  ) => {
    const totalSeconds = Math.floor(
      milliseconds / 1000
    );

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds =
      totalSeconds % 60;

    return [
      hours
        .toString()
        .padStart(2, '0'),
      minutes
        .toString()
        .padStart(2, '0'),
      seconds
        .toString()
        .padStart(2, '0'),
    ].join(':');
  };

  /*
   * ================================
   * ТАЙМЕР АВТОРИЗАЦІЇ
   * ================================
   */

  const formatAuthTime = (
    totalSeconds: number
  ) => {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds =
      totalSeconds % 60;

    return [
      hours
        .toString()
        .padStart(2, '0'),
      minutes
        .toString()
        .padStart(2, '0'),
      seconds
        .toString()
        .padStart(2, '0'),
    ].join(':');
  };

  /*
   * ================================
   * ПОВІДОМЛЕННЯ
   * ================================
   */

  const [message, setMessage] =
    useState('');

  const openMessageScreen = () => {
    router.push({
      pathname: '/message',
      params: {
        message,
      },
    });
  };

  /*
   * ================================
   * SHARE
   * ================================
   */

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `Моя подорож: ${currentCity.name}\n\n${currentCity.description}`,
      });
    } catch (error) {
      console.log(
        '🔴 Помилка Share:',
        error
      );
    }
  };

  /*
   * ================================
   * SUPABASE
   * ================================
   */

  useEffect(() => {
    const checkDatabase =
      async () => {
        const result =
          await testSupabaseConnection();

        if (result.success) {
          console.log(
            '🟢 БАЗА ПРАЦЮЄ'
          );
          console.log(
            'Користувачі:',
            result.data
          );
        } else {
          console.log(
            '🔴 БАЗА НЕ ПРАЦЮЄ:',
            result.message
          );
        }
      };

    checkDatabase();
  }, []);

  /*
   * ================================
   * ВИХІД
   * ================================
   */

  const handleLogout = async () => {
    await signOut();

    router.replace('/login');
  };

  /*
   * ================================
   * ТЕКСТИ МОВОЮ
   * ================================
   */

  const texts = {
    uk: {
      title: 'МІСТА СВІТУ',
      chooseCity: 'Оберіть місто:',
      chooseLanguage: 'Мова:',
      ukrainian: 'Українська',
      english: 'English',
      welcome: 'Вітаємо',
      login: 'Логін',
      authTime: 'Час авторизації',
      timer: 'Таймер',
      start: 'Старт',
      pause: 'Пауза',
      reset: 'Скинути',
      message: 'Повідомлення',
      messagePlaceholder:
        'Введіть повідомлення...',
      openMessage: 'Відкрити повідомлення',
      share: 'Поділитися',
      logout: 'Вийти',
    },

    en: {
      title: 'CITIES OF THE WORLD',
      chooseCity: 'Choose a city:',
      chooseLanguage: 'Language:',
      ukrainian: 'Ukrainian',
      english: 'English',
      welcome: 'Welcome',
      login: 'Login',
      authTime: 'Authorization time',
      timer: 'Timer',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      message: 'Message',
      messagePlaceholder:
        'Enter a message...',
      openMessage: 'Open message',
      share: 'Share',
      logout: 'Log out',
    },
  };

  const t = texts[
    language === 'en'
      ? 'en'
      : 'uk'
  ];

  return (
    <ImageBackground
      source={currentCity.image}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.overlay}>
          {/* ========================= */}
          {/* КОРИСТУВАЧ */}
          {/* ========================= */}

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {t.welcome},{' '}
              {user?.name ||
                'користувачу'}!
            </Text>

            {user?.login && (
              <Text style={styles.userLogin}>
                {t.login}: {user.login}
              </Text>
            )}
          </View>

          {/* ========================= */}
          {/* ТАЙМЕР АВТОРИЗАЦІЇ */}
          {/* ========================= */}

          <View
            style={styles.authTimer}
          >
            <Text
              style={
                styles.authTimerTitle
              }
            >
              {t.authTime}
            </Text>

            <Text
              style={
                styles.authTimerValue
              }
            >
              {formatAuthTime(
                authElapsedSeconds
              )}
            </Text>
          </View>

          {/* ========================= */}
          {/* ЗАГОЛОВОК */}
          {/* ========================= */}

          <Text style={styles.title}>
            {t.title}
          </Text>

          {/* ========================= */}
          {/* МОВА */}
          {/* ========================= */}

          <Text style={styles.label}>
            {t.chooseLanguage}
          </Text>

          <View
            style={
              styles.dropdownContainer
            }
          >
            <Pressable
              style={
                styles.dropdownButton
              }
              onPress={() =>
                setIsLanguageOpen(
                  !isLanguageOpen
                )
              }
            >
              <Text
                style={
                  styles.dropdownText
                }
              >
                {language === 'uk'
                  ? t.ukrainian
                  : t.english}
              </Text>

              <Text
                style={styles.arrow}
              >
                {isLanguageOpen
                  ? '▲'
                  : '▼'}
              </Text>
            </Pressable>

            {isLanguageOpen && (
              <View
                style={
                  styles.dropdownList
                }
              >
                <Pressable
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleLanguageSelect(
                      'uk'
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    Українська
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleLanguageSelect(
                      'en'
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    English
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* ========================= */}
          {/* МІСТО */}
          {/* ========================= */}

          <Text style={styles.label}>
            {t.chooseCity}
          </Text>

          <View
            style={
              styles.dropdownContainer
            }
          >
            <Pressable
              style={
                styles.dropdownButton
              }
              onPress={() =>
                setIsCityOpen(
                  !isCityOpen
                )
              }
            >
              <Text
                style={
                  styles.dropdownText
                }
              >
                {
                  cities[selectedCity]
                    .name
                }
              </Text>

              <Text
                style={styles.arrow}
              >
                {isCityOpen
                  ? '▲'
                  : '▼'}
              </Text>
            </Pressable>

            {isCityOpen && (
              <View
                style={
                  styles.dropdownList
                }
              >
                <Pressable
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleCitySelect(
                      'paris'
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    Париж
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleCitySelect(
                      'tokyo'
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    Токіо
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleCitySelect(
                      'newyork'
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    Нью-Йорк
                  </Text>
                </Pressable>

                <Pressable
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleCitySelect(
                      'kyiv'
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    Київ
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* ========================= */}
          {/* ІНФОРМАЦІЯ ПРО МІСТО */}
          {/* ========================= */}

          <View
            style={styles.infoContainer}
          >
            <Text
              style={styles.cityName}
            >
              {currentCity.name}
            </Text>

            <Text
              style={styles.description}
            >
              {currentCity.description}
            </Text>
          </View>

          {/* ========================= */}
          {/* ЗВИЧАЙНИЙ ТАЙМЕР */}
          {/* ========================= */}

          <View
            style={styles.timerContainer}
          >
            <Text
              style={styles.sectionTitle}
            >
              {t.timer}
            </Text>

            <Text
              style={styles.timerValue}
            >
              {formatTimer(
                timerState.elapsedMs
              )}
            </Text>

            <View
              style={
                styles.timerButtons
              }
            >
              {!timerState.running ? (
                <Pressable
                  style={
                    styles.primaryButton
                  }
                  onPress={
                    startTimer
                  }
                >
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {t.start}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={
                    styles.warningButton
                  }
                  onPress={
                    pauseTimer
                  }
                >
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {t.pause}
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={
                  styles.secondaryButton
                }
                onPress={
                  resetTimer
                }
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  {t.reset}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ========================= */}
          {/* ПОВІДОМЛЕННЯ */}
          {/* ========================= */}

          <View
            style={styles.messageContainer}
          >
            <Text
              style={styles.sectionTitle}
            >
              {t.message}
            </Text>

            <TextInput
              style={styles.messageInput}
              placeholder={
                t.messagePlaceholder
              }
              placeholderTextColor="#888888"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <Pressable
              style={
                styles.primaryButton
              }
              onPress={
                openMessageScreen
              }
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                {t.openMessage}
              </Text>
            </Pressable>

            <Pressable
              style={
                styles.secondaryButton
              }
              onPress={
                handleShare
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                {t.share}
              </Text>
            </Pressable>
          </View>

          {/* ========================= */}
          {/* ВИХІД */}
          {/* ========================= */}

          <Pressable
            style={
              styles.logoutButton
            }
            onPress={
              handleLogout
            }
          >
            <Text
              style={
                styles.logoutButtonText
              }
            >
              {t.logout}
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

  scrollContent: {
    flexGrow: 1,
  },

  overlay: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor:
      'rgba(255, 255, 255, 0.84)',
  },

  userInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },

  userName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000000',
  },

  userLogin: {
    fontSize: 15,
    color: '#555555',
    marginTop: 5,
  },

  authTimer: {
    backgroundColor: '#EAF4FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B9DDFF',
  },

  authTimerTitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 5,
  },

  authTimerValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#208AEF',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000000',
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
    fontWeight: '500',
  },

  dropdownContainer: {
    marginBottom: 20,
  },

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

  dropdownText: {
    fontSize: 18,
    color: '#000000',
  },

  arrow: {
    fontSize: 18,
    color: '#000000',
  },

  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  dropdownItemText: {
    fontSize: 18,
    color: '#000000',
  },

  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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

  timerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },

  timerValue: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#208AEF',
    marginBottom: 15,
  },

  timerButtons: {
    width: '100%',
    gap: 10,
  },

  primaryButton: {
    backgroundColor: '#208AEF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  warningButton: {
    backgroundColor: '#F39C12',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#208AEF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButtonText: {
    color: '#208AEF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },

  messageInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
  },

  logoutButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});