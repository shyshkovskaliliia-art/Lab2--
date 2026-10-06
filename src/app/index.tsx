import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { testSupabaseConnection } from '@/lib/testSupabase';
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

import {
  isLanguage,
  languageOptions,
  translations,
  type CityKey,
  type Language,
} from '@/constants/translations';

type City = {
  image: any;
};

type TimerState = {
  startedAt: number | null;
  elapsedMs: number;
  running: boolean;
};

const TIMER_STORAGE_KEY = 'lab3_timer_state';
const LANGUAGE_STORAGE_KEY = 'lab3_language';

const EMPTY_TIMER: TimerState = {
  startedAt: null,
  elapsedMs: 0,
  running: false,
};

const cities: Record<CityKey, City> = {
  paris: {
    image: require('../../assets/images/paris.jpg'),
  },

  tokyo: {
    image: require('../../assets/images/tokyo.jpg'),
  },

  newyork: {
    image: require('../../assets/images/newyork.jpg'),
  },

  kyiv: {
    image: require('../../assets/images/kyiv.jpg'),
  },
};

function getCurrentElapsed(timer: TimerState) {
  if (!timer.running || timer.startedAt === null) {
    return timer.elapsedMs;
  }

  return timer.elapsedMs + Math.max(0, Date.now() - timer.startedAt);
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export default function HomeScreen() {
  // =========================
  // МІСТА
  // =========================

  const [selectedCity, setSelectedCity] =
    useState<CityKey>('paris');

  const [displayedCity, setDisplayedCity] =
    useState<CityKey>('paris');

  const [isCityOpen, setIsCityOpen] =
    useState(false);

  // =========================
  // ПОВІДОМЛЕННЯ
  // =========================

  const [message, setMessage] = useState('');

  // =========================
  // МОВА
  // =========================

  const [language, setLanguage] =
    useState<Language>('uk');

  const [isLanguageOpen, setIsLanguageOpen] =
    useState(false);

  // =========================
  // ТАЙМЕР
  // =========================

  const [timer, setTimer] =
    useState<TimerState>(EMPTY_TIMER);

  const [elapsedMs, setElapsedMs] =
    useState(0);

  // =========================
  // ПОТОЧНІ ДАНІ
  // =========================

  const currentCity = cities[displayedCity];

  const t = translations[language];

  // =========================
  // ЗАВАНТАЖЕННЯ ДАНИХ
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        // Завантаження таймера
        const savedTimer =
          await AsyncStorage.getItem(
            TIMER_STORAGE_KEY
          );

        if (savedTimer) {
          const parsedTimer: TimerState =
            JSON.parse(savedTimer);

          setTimer(parsedTimer);
          setElapsedMs(
            getCurrentElapsed(parsedTimer)
          );
        }

        // Завантаження мови
        const savedLanguage =
          await AsyncStorage.getItem(
            LANGUAGE_STORAGE_KEY
          );

        if (
          savedLanguage &&
          isLanguage(savedLanguage)
        ) {
          setLanguage(savedLanguage);
        } else {
          // Якщо мову ще не вибирали,
          // беремо мову пристрою
          const deviceLanguage =
            getLocales()[0]?.languageCode;

          if (
            deviceLanguage &&
            isLanguage(deviceLanguage)
          ) {
            setLanguage(deviceLanguage);
          }
        }
      } catch (error) {
        console.log(
          'Помилка завантаження даних:',
          error
        );
      }
    };

    loadData();
  }, []);

  // =========================
  // ОНОВЛЕННЯ ТАЙМЕРА
  // =========================

  useEffect(() => {
    const updateTimer = () => {
      setElapsedMs(
        getCurrentElapsed(timer)
      );
    };

    updateTimer();

    if (!timer.running) {
      return;
    }

    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  // =========================
  // РОБОТА ПРИ ЗГОРТАННІ /
  // ПОВЕРНЕННІ / ПЕРЕКРИТТІ
  // =========================

  useEffect(() => {
    const updateTimer = () => {
      setElapsedMs(
        getCurrentElapsed(timer)
      );
    };

    const appStateSubscription =
      AppState.addEventListener(
        'change',
        updateTimer
      );

    const focusSubscription =
      AppState.addEventListener(
        'focus',
        updateTimer
      );

    const blurSubscription =
      AppState.addEventListener(
        'blur',
        updateTimer
      );

    return () => {
      appStateSubscription.remove();
      focusSubscription.remove();
      blurSubscription.remove();
    };
  }, [timer]);

  // =========================
  // ВИБІР МІСТА
  // =========================

  const handleCitySelect = (
    cityKey: CityKey
  ) => {
    setSelectedCity(cityKey);
    setDisplayedCity(cityKey);
    setIsCityOpen(false);
  };

  // =========================
  // ВИБІР МОВИ
  // =========================

  const handleLanguageSelect = async (
    nextLanguage: Language
  ) => {
    setLanguage(nextLanguage);
    setIsLanguageOpen(false);

    try {
      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        nextLanguage
      );
    } catch (error) {
      console.log(
        'Помилка збереження мови:',
        error
      );
    }
  };

  // =========================
  // ЗБЕРЕЖЕННЯ ТАЙМЕРА
  // =========================

  const saveTimerState = async (
    nextTimer: TimerState
  ) => {
    setTimer(nextTimer);

    setElapsedMs(
      getCurrentElapsed(nextTimer)
    );

    try {
      await AsyncStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(nextTimer)
      );
    } catch (error) {
      console.log(
        'Помилка збереження таймера:',
        error
      );
    }
  };

  // =========================
  // ПОЧАТИ ТАЙМЕР
  // =========================

  const handleStartTimer = async () => {
    if (timer.running) {
      return;
    }

    const now = Date.now();

    const nextTimer: TimerState = {
      startedAt: now,
      elapsedMs: timer.elapsedMs,
      running: true,
    };

    await saveTimerState(nextTimer);
  };

  // =========================
  // ПРИЗУПИНИТИ ТАЙМЕР
  // =========================

  const handlePauseTimer = async () => {
    if (!timer.running) {
      return;
    }

    const currentElapsed =
      getCurrentElapsed(timer);

    const nextTimer: TimerState = {
      startedAt: null,
      elapsedMs: currentElapsed,
      running: false,
    };

    await saveTimerState(nextTimer);
  };

  // =========================
  // СКИНУТИ ТАЙМЕР
  // =========================

  const handleResetTimer = async () => {
    await saveTimerState(
      EMPTY_TIMER
    );
  };

  // =========================
  // ПОВІДОМЛЕННЯ
  // =========================

  const handleSendInApp = () => {
    if (message.trim()) {
      router.push({
        pathname: '/message' as any,
        params: {
          text: message,
          lang: language,
        },
      });
    }
  };

  // =========================
  // SHARE
  // =========================

  const handleShare = async () => {
    if (message.trim()) {
      await Share.share({
        message: message,
      });
    }
  };

  // Поточна назва вибраної мови
  const currentLanguage =
    languageOptions.find(
      (item) => item.code === language
    );

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
        {/* ========================= */}
        {/* ВЕРХНЯ ПАНЕЛЬ */}
        {/* ========================= */}

        <View style={styles.topBar}>
          <View />

          {/* Вибір мови */}
          <View style={styles.languageContainer}>
            <Pressable
              style={styles.languageButton}
              onPress={() =>
                setIsLanguageOpen(
                  !isLanguageOpen
                )
              }
            >
              <Text style={styles.languageText}>
                {currentLanguage?.label}
              </Text>

              <Text style={styles.languageArrow}>
                {isLanguageOpen
                  ? '▲'
                  : '▼'}
              </Text>
            </Pressable>

            {isLanguageOpen && (
              <View
                style={styles.languageList}
              >
                {languageOptions.map(
                  (option) => (
                    <Pressable
                      key={option.code}
                      style={
                        styles.languageItem
                      }
                      onPress={() =>
                        handleLanguageSelect(
                          option.code
                        )
                      }
                    >
                      <Text
                        style={
                          styles.languageItemText
                        }
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
            )}
          </View>
        </View>

        {/* ========================= */}
        {/* ЗАГОЛОВОК */}
        {/* ========================= */}

        <Text style={styles.title}>
          {t.title}
        </Text>

        {/* ========================= */}
        {/* МІСТА */}
        {/* ========================= */}

        <Text style={styles.label}>
          {t.chooseCity}
        </Text>

        <View style={styles.dropdownContainer}>
          <Pressable
            style={styles.dropdownButton}
            onPress={() =>
              setIsCityOpen(!isCityOpen)
            }
          >
            <Text
              style={styles.dropdownText}
            >
              {
                t.cities[selectedCity]
                  .name
              }
            </Text>

            <Text style={styles.arrow}>
              {isCityOpen ? '▲' : '▼'}
            </Text>
          </Pressable>

          {isCityOpen && (
            <View
              style={styles.dropdownList}
            >
              {(
                [
                  'paris',
                  'tokyo',
                  'newyork',
                  'kyiv',
                ] as CityKey[]
              ).map((cityKey) => (
                <Pressable
                  key={cityKey}
                  style={
                    styles.dropdownItem
                  }
                  onPress={() =>
                    handleCitySelect(
                      cityKey
                    )
                  }
                >
                  <Text
                    style={
                      styles.dropdownItemText
                    }
                  >
                    {
                      t.cities[cityKey]
                        .name
                    }
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ========================= */}
        {/* ІНФОРМАЦІЯ ПРО МІСТО */}
        {/* ========================= */}

        <View style={styles.infoContainer}>
          <Text style={styles.cityName}>
            {t.cities[displayedCity].name}
          </Text>

          <Text style={styles.description}>
            {
              t.cities[displayedCity]
                .description
            }
          </Text>
        </View>

        {/* ========================= */}
        {/* ТАЙМЕР */}
        {/* ========================= */}

        <View style={styles.timerSection}>
          <Text style={styles.timerTitle}>
            {t.timer.title}
          </Text>

          <Text style={styles.timerValue}>
            {formatTime(elapsedMs)}
          </Text>

          <Text style={styles.timerStatus}>
            {timer.running
              ? t.timer.running
              : t.timer.paused}
          </Text>

          <View style={styles.timerButtons}>
            {!timer.running ? (
              <Pressable
                style={styles.startButton}
                onPress={
                  handleStartTimer
                }
              >
                <Text
                  style={
                    styles.timerButtonText
                  }
                >
                  ▶ {t.timer.start}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.pauseButton}
                onPress={
                  handlePauseTimer
                }
              >
                <Text
                  style={
                    styles.timerButtonText
                  }
                >
                  ⏸ {t.timer.pause}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={styles.resetButton}
              onPress={
                handleResetTimer
              }
            >
              <Text
                style={
                  styles.timerButtonText
                }
              >
                🔄 {t.timer.reset}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ========================= */}
        {/* ПОВІДОМЛЕННЯ */}
        {/* ========================= */}

        <View style={styles.messageSection}>
          <Text
            style={styles.messageTitle}
          >
            {t.message.title}
          </Text>

          <Text
            style={styles.messageLabel}
          >
            {t.message.inputLabel}
          </Text>

          <TextInput
            style={styles.messageInput}
            placeholder={
              t.message.placeholder
            }
            placeholderTextColor="#888888"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <Pressable
            style={styles.sendButton}
            onPress={
              handleSendInApp
            }
          >
            <Text
              style={styles.sendButtonText}
            >
              {t.message.sendInApp}
            </Text>
          </Pressable>

          <Pressable
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text
              style={styles.shareButtonText}
            >
              {t.message.shareApps}
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
    backgroundColor:
      'rgba(255, 255, 255, 0.82)',
  },

  // =========================
  // ВЕРХНЯ ПАНЕЛЬ
  // =========================

  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  languageContainer: {
    position: 'relative',
    zIndex: 100,
    elevation: 100,
  },

  languageButton: {
    minWidth: 145,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  languageText: {
    fontSize: 14,
    color: '#000000',
  },

  languageArrow: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 5,
  },

  languageList: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 180,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 200,
    elevation: 200,
  },

  languageItem: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  languageItemText: {
    fontSize: 15,
    color: '#000000',
  },

  // =========================
  // ЗАГОЛОВОК
  // =========================

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

  // =========================
  // DROPDOWN МІСТ
  // =========================

  dropdownContainer: {
    marginBottom: 25,
    zIndex: 50,
    elevation: 50,
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

  // =========================
  // ІНФОРМАЦІЯ ПРО МІСТО
  // =========================

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

  // =========================
  // ТАЙМЕР
  // =========================

  timerSection: {
    marginTop: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },

  timerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },

  timerValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#208AEF',
    letterSpacing: 2,
    marginVertical: 10,
  },

  timerStatus: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 15,
  },

  timerButtons: {
    width: '100%',
    gap: 10,
  },

  startButton: {
    backgroundColor: '#208AEF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },

  pauseButton: {
    backgroundColor: '#E67E22',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },

  resetButton: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },

  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // =========================
  // ПОВІДОМЛЕННЯ
  // =========================

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