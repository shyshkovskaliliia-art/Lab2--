export type Language = 'uk' | 'en' | 'de';

export type CityKey = 'paris' | 'tokyo' | 'newyork' | 'kyiv';

export type TranslationSet = {
  title: string;
  chooseCity: string;

  timer: {
    title: string;
    start: string;
    pause: string;
    reset: string;
    running: string;
    paused: string;
  };

  message: {
    title: string;
    inputLabel: string;
    placeholder: string;
    sendInApp: string;
    shareApps: string;
    sentMessage: string;
    yourMessage: string;
    missing: string;
  };

  cities: Record<
    CityKey,
    {
      name: string;
      description: string;
    }
  >;
};

export const translations: Record<Language, TranslationSet> = {
  uk: {
    title: 'МІСТА СВІТУ',
    chooseCity: 'Оберіть місто:',

    timer: {
      title: 'Таймер',
      start: 'Почати',
      pause: 'Пауза',
      reset: 'Скинути',
      running: 'Таймер працює',
      paused: 'Таймер призупинено',
    },

    message: {
      title: 'Повідомлення',
      inputLabel: 'Введіть повідомлення:',
      placeholder: 'Напишіть повідомлення...',
      sendInApp: 'Переслати в застосунку',
      shareApps: 'Поділитися з іншими додатками',
      sentMessage: 'Надіслане повідомлення',
      yourMessage: 'Ваше повідомлення:',
      missing: 'Повідомлення відсутнє',
    },

    cities: {
      paris: {
        name: 'Париж',
        description:
          'Столиця Франції, відома Ейфелевою вежею, Лувром та романтичною атмосферою.',
      },
      tokyo: {
        name: 'Токіо',
        description:
          'Столиця Японії, яка поєднує сучасні технології, традиції та яскраву міську культуру.',
      },
      newyork: {
        name: 'Нью-Йорк',
        description:
          'Одне з найбільших міст США, відоме хмарочосами, Таймс-сквер та Центральним парком.',
      },
      kyiv: {
        name: 'Київ',
        description:
          'Столиця України та одне з найдавніших міст Східної Європи.',
      },
    },
  },

  en: {
    title: 'CITIES OF THE WORLD',
    chooseCity: 'Choose a city:',

    timer: {
      title: 'Timer',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      running: 'Timer is running',
      paused: 'Timer is paused',
    },

    message: {
      title: 'Message',
      inputLabel: 'Enter a message:',
      placeholder: 'Write a message...',
      sendInApp: 'Send in the app',
      shareApps: 'Share with other apps',
      sentMessage: 'Sent message',
      yourMessage: 'Your message:',
      missing: 'No message',
    },

    cities: {
      paris: {
        name: 'Paris',
        description:
          'The capital of France, famous for the Eiffel Tower, the Louvre and its romantic atmosphere.',
      },
      tokyo: {
        name: 'Tokyo',
        description:
          'The capital of Japan, combining modern technology, traditions and vibrant urban culture.',
      },
      newyork: {
        name: 'New York',
        description:
          'One of the largest cities in the USA, famous for skyscrapers, Times Square and Central Park.',
      },
      kyiv: {
        name: 'Kyiv',
        description:
          'The capital of Ukraine and one of the oldest cities in Eastern Europe.',
      },
    },
  },

  de: {
    title: 'STÄDTE DER WELT',
    chooseCity: 'Stadt auswählen:',

    timer: {
      title: 'Timer',
      start: 'Starten',
      pause: 'Pause',
      reset: 'Zurücksetzen',
      running: 'Timer läuft',
      paused: 'Timer pausiert',
    },

    message: {
      title: 'Nachricht',
      inputLabel: 'Nachricht eingeben:',
      placeholder: 'Nachricht schreiben...',
      sendInApp: 'In der App senden',
      shareApps: 'Mit anderen Apps teilen',
      sentMessage: 'Gesendete Nachricht',
      yourMessage: 'Ihre Nachricht:',
      missing: 'Keine Nachricht',
    },

    cities: {
      paris: {
        name: 'Paris',
        description:
          'Die Hauptstadt Frankreichs, bekannt für den Eiffelturm, den Louvre und ihre romantische Atmosphäre.',
      },
      tokyo: {
        name: 'Tokio',
        description:
          'Die Hauptstadt Japans, die moderne Technologie, Traditionen und eine lebendige Stadtkultur verbindet.',
      },
      newyork: {
        name: 'New York',
        description:
          'Eine der größten Städte der USA, bekannt für Wolkenkratzer, den Times Square und den Central Park.',
      },
      kyiv: {
        name: 'Kyjiw',
        description:
          'Die Hauptstadt der Ukraine und eine der ältesten Städte Osteuropas.',
      },
    },
  },
};

export const languageOptions = [
  {
    code: 'uk',
    label: '🇺🇦 Українська',
  },
  {
    code: 'en',
    label: '🇬🇧 English',
  },
  {
    code: 'de',
    label: '🇩🇪 Deutsch',
  },
] as const;

export const isLanguage = (value: string): value is Language => {
  return value === 'uk' || value === 'en' || value === 'de';
};