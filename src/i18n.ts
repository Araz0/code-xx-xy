import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

type QuizLanguage = 'en' | 'de'

function getBrowserLanguage(): QuizLanguage {
  if (
    typeof navigator !== 'undefined' &&
    navigator.language?.toLowerCase().startsWith('de')
  ) {
    return 'de'
  }

  return 'en'
}

function getStoredLanguage(): QuizLanguage {
  return getBrowserLanguage()
}

const resources = {
  en: {
    translation: {
      app: {
        name: 'CODE XX/XY',
      },
      titles: {
        home: 'CODE XX/XY',
        form: 'CODE XX/XY | Quiz',
        results: 'CODE XX/XY | Results',
        printResults: 'CODE XX/XY | Print results',
        printTest: 'CODE XX/XY | Print test',
        presenter: 'CODE XX/XY | Presenter',
      },
      languageToggle: {
        en: 'English',
        de: 'Deutsch',
      },
      home: {
        title: 'CODE XX/XY',
        start: 'Start',
      },
      quiz: {
        progress: 'Question {{current}} of {{total}}',
        next: 'Next',
      },
      userInfo: {
        title: 'Almost there!',
        nameLabel: 'Name (optional)',
        ageLabel: 'Age (optional)',
        namePlaceholder: 'Enter your name',
        agePlaceholder: 'Enter your age',
        finish: 'Finish',
        disclaimer:
          'Providing your name and age is voluntary and will only be used to display or print the results. This information will not be stored permanently.',
      },
      results: {
        title: 'Your perception compared to real data',
        restart: 'Restart',
        home: 'Home',
        print: 'Print',
        printHeader: 'Your perception compared to real data',
        printFooterNote: '*in relation to the data',
        disclaimer:
          'The information about name and age is voluntary and is used solely to display and print the result. It is not stored permanently.',
        legend: {
          correct: 'Correct answer',
          historical: 'Previous answers',
          user: 'Your answer',
          latest: 'Latest answer',
        },
        comparison: {
          question: 'Q{{index}}: {{title}}',
          yourEstimate: 'Your estimate: {{value}}%',
          real: 'Real: {{value}}%',
        },
      },
      printChart: {
        ariaLabel: 'Printable chart preview',
        shortTitle: 'CODE XX/XY',
        biasLegend: {
          ariaLabel: 'Bias direction legend',
          left: 'Bias against women*',
          center: 'data-close',
          right: 'Bias against men*',
        },
        circleLegend: {
          medium: 'Correct answer',
          big: 'Your answer',
        },
        biasDirection: {
          men: 'bias against men',
          women: 'bias against women',
          neutral: 'no clear bias direction',
        },
        biasBands: {
          '0_5': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your estimates match the data almost exactly. You have an extremely realistic picture of the current gender distribution.',
          },
          '6_10': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your perception deviates only slightly from the real numbers. You are close to the data in almost every area, with only a few small distortions.',
          },
          '11_15': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your estimates are mostly realistic, but they already show initial systematic deviations. Small internalized patterns may have influenced your perception.',
          },
          '16_20': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your perception differs noticeably from the data. A pattern in your assumptions becomes visible, and it is time to critically examine your own perspective.',
          },
          '21_25': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'A clear shift away from reality is visible. Unconscious assumptions or limited information seem to shape your view here.',
          },
          '26_30': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your estimates are moving noticeably away from the real numbers. Distortions that can stem from familiar role stereotypes are already reflected here.',
          },
          '31_35': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'The deviation from the data is clearly visible. Internalized thought patterns are influencing your perception strongly here, and awareness is a first step toward change.',
          },
          '36_40': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'A stable bias emerges: your assumptions and reality diverge in many areas. Socially shaped images seem to influence your worldview more than you realized.',
          },
          '41_45': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Almost half of your assumptions differ from the facts. The effect of social conditioning becomes clearly noticeable here, and you can now see where preconceptions shape your picture.',
          },
          '46_50': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Half of your perceptions do not match reality. This is a signal of how ambivalent our worldview often is.',
          },
          '51_55': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'More than half of your estimates are off the mark. Widespread role stereotypes are likely contributing significantly to this distortion.',
          },
          '56_60': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your perception differs from reality in many respects. The result makes the influence of deeply rooted assumptions in your perception clear.',
          },
          '61_65': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'The distance from the actual state is pronounced. Conditioned expectations have strongly influenced your estimates, and you can now question them more consciously.',
          },
          '66_70': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Many of your assumptions conflict with the real numbers. Inner preconceptions clearly steer your view here, and recognizing this gap is very important.',
          },
          '71_75': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your perception is strongly shifted. Deeply rooted role images shape your worldview in many areas, and this insight offers a chance to rethink personal patterns.',
          },
          '76_80': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your assumptions move very far away from reality. Familiar stereotypes dominate your estimates here, and this result invites you to question your worldview fundamentally.',
          },
          '81_85': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'The discrepancy to the data is extremely large. Hardened mental images have shaped your perception almost completely, and you can now consciously counter them and learn something new.',
          },
          '86_90': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your estimates deviate massively from the facts. The power of prejudice becomes especially clear here, although reflection can help gradually correct your view.',
          },
          '91_95': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'Your perception is almost completely disconnected from reality. This result shows clearly how strongly entrenched ideas can distort a worldview, and how valuable it can be to question them.',
          },
          '96_100': {
            withIdentity:
              '{{name}} ({{age}} years), your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            withoutIdentity:
              'Your measured bias is {{percent}}% in the direction of {{biasDirection}}.',
            body: 'There is a maximum difference between your perception and the real data. Deeply ingrained assumptions have fully shaped your view, and this is a wake-up call to examine and possibly reshape those ideas.',
          },
        },
      },
      printResults: {
        noResults: 'No results to print.',
        backHome: 'Back Home',
      },
      printTest: {
        title: 'Print Test',
        results: 'Results',
        home: 'Home',
        instructions:
          'Paste JSON in {"lines":[{"points":[0..100]}...]} format with 13 lines.',
        loadDemoData: 'Load Demo Data',
        randomizeData: 'Randomize Data',
        printPage: 'Print Page',
        refreshPreview: 'Refresh Preview',
        invalidJson: 'Invalid JSON: {{message}}',
      },
      presenter: {
        header: 'Presenter',
        loading: 'Loading live results...',
      },
      errors: {
        supabaseNotConfigured: 'Supabase is not configured.',
        fetchResultsFailed: 'Failed to load live results: {{message}}',
      },
    },
  },
  de: {
    translation: {
      app: {
        name: 'CODE XX/XY',
      },
      titles: {
        home: 'CODE XX/XY',
        form: 'CODE XX/XY | Quiz',
        results: 'CODE XX/XY | Ergebnisse',
        printResults: 'CODE XX/XY | Druckansicht',
        printTest: 'CODE XX/XY | Drucktest',
        presenter: 'CODE XX/XY | Präsentation',
      },
      languageToggle: {
        en: 'Englisch',
        de: 'Deutsch',
      },
      home: {
        title: 'CODE XX/XY',
        start: 'Starten',
      },
      quiz: {
        progress: 'Frage {{current}} von {{total}}',
        next: 'Weiter',
      },
      userInfo: {
        title: 'Fast geschafft!',
        nameLabel: 'Name (optional)',
        ageLabel: 'Alter (optional)',
        namePlaceholder: 'Geben Sie Ihren Namen ein',
        agePlaceholder: 'Geben Sie Ihr Alter ein',
        finish: 'Fertig',
        disclaimer:
          'Die Angaben zu Name und Alter sind freiwillig und werden ausschließlich zur Darstellung bzw. zum Ausdruck des Ergebnisses verwendet. Eine dauerhafte Speicherung erfolgt nicht.',
      },
      results: {
        title: 'Deine Wahrnehmung im Vergleich zu den tatsächlichen Daten',
        restart: 'Neu starten',
        home: 'Startseite',
        print: 'Drucken',
        printHeader:
          'Deine Wahrnehmung im Vergleich zu den tatsächlichen Daten',
        printFooterNote: '*im Verhältnis zur Datenlage',
        legend: {
          correct: 'Richtige Antwort',
          historical: 'Vorherige Antworten',
          user: 'Deine Antwort',
          latest: 'Letzte Antwort',
        },
        comparison: {
          question: 'F{{index}}: {{title}}',
          yourEstimate: 'Deine Antwort: {{value}}%',
          real: 'Reale Daten: {{value}}%',
        },
      },
      printChart: {
        ariaLabel: 'Druckansicht der Grafik',
        shortTitle: 'CODE XX/XY',
        biasLegend: {
          ariaLabel: 'Legende zur Bias-Richtung',
          left: 'Bias gegen Frauen*',
          center: 'datennah',
          right: 'Bias gegen Männer*',
        },
        circleLegend: {
          medium: 'Richtige Antwort',
          big: 'Deine Antwort',
        },
        biasDirection: {
          men: 'Bias gegen Männer',
          women: 'Bias gegen Frauen',
          neutral: 'keine klare Bias-Richtung',
        },
        biasBands: {
          '0_5': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Einschätzungen stimmen fast exakt mit der Datenlage überein. Du hast ein äußerst realistisches Bild der aktuellen Geschlechterverteilung.',
          },
          '6_10': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Wahrnehmung weicht nur minimal von den realen Zahlen ab. Du bist in nahezu allen Bereichen datennah, mit vereinzelten kleinen Verzerrungen.',
          },
          '11_15': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Einschätzungen sind überwiegend realitätsnah, zeigen aber erste systematische Abweichungen. Kleine verinnerlichte Muster könnten hier deine Wahrnehmung beeinflusst haben.',
          },
          '16_20': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Wahrnehmung weicht merklich von der Datenlage ab. Ein Denkmuster in deinen Annahmen wird sichtbar – Zeit, die eigene Perspektive kritisch zu beleuchten.',
          },
          '21_25': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Es zeigt sich eine deutliche Verschiebung gegenüber der Realität. Unbewusste Annahmen oder begrenzte Informationen prägen hier offenbar dein Bild.',
          },
          '26_30': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Einschätzungen entfernen sich spürbar von den realen Zahlen. Hier spiegeln sich bereits Verzerrungen wider, die aus gängigen Rollenbildern stammen können.',
          },
          '31_35': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Die Abweichung zur Datenlage ist klar erkennbar. Verinnerlichte Denkmuster beeinflussen deine Wahrnehmung hier deutlich – das Bewusstwerden ist ein erster Schritt zu Veränderung.',
          },
          '36_40': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Ein stabiler Bias tritt zutage – deine Vorstellungen und die Realität klaffen in vielen Bereichen auseinander. Gesellschaftlich geprägte Bilder prägen offenbar dein Weltbild stärker, als dir bewusst war.',
          },
          '41_45': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Fast die Hälfte deiner Annahmen weicht von den Fakten ab. Hier wird die Wirkung gesellschaftlicher Prägungen spürbar – du erkennst nun deutlich, wo Vorannahmen dein Bild formen.',
          },
          '46_50': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Die Hälfte deiner Vorstellungen stimmt nicht mit der Realität überein. Dies ist ein Signal, wie ambivalent unser Weltbild oft ist.',
          },
          '51_55': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Über die Hälfte deiner Einschätzungen liegen neben den Fakten. Verbreitete Rollenklischees dürften wesentlich zu dieser Verzerrung beitragen.',
          },
          '56_60': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Wahrnehmung unterscheidet sich in weiten Teilen von der Realität. Das Ergebnis macht den Einfluss tief verankerter Annahmen deiner Wahrnehmung deutlich.',
          },
          '61_65': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Die Distanz zum Ist-Zustand ist deutlich ausgeprägt. Konditionierte Vorstellungen haben deine Einschätzungen stark beeinflusst – nun kannst du sie bewusster hinterfragen.',
          },
          '66_70': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Viele deiner Annahmen stehen im Widerspruch zu den realen Zahlen. Innere Vorannahmen lenken hier spürbar dein Bild. Das Erkennen dieser Differenz ist sehr wichtig.',
          },
          '71_75': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Wahrnehmung ist stark verschoben. Tief verankerte Rollenbilder prägen dein Weltbild in vielen Bereichen – diese Erkenntnis bietet Gelegenheit, persönliche Denkmuster zu überdenken.',
          },
          '76_80': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Vorstellungen entfernen sich sehr weit von der Realität. Gewohnte Klischees dominieren hier deine Einschätzungen – dieses Ergebnis lädt dazu ein, das eigene Weltbild grundlegend zu hinterfragen.',
          },
          '81_85': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Die Diskrepanz zur Datenlage ist äußerst groß. Verfestigte Bilder haben deine Wahrnehmung nahezu vollständig geprägt – du kannst nun bewusst gegensteuern und Neues lernen.',
          },
          '86_90': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Einschätzungen weichen massiv von den Fakten ab. Hier wird die Wirkmacht von Vorurteilen besonders deutlich – doch Reflexion kann helfen, dein Bild nach und nach zu korrigieren.',
          },
          '91_95': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Deine Wahrnehmung ist fast völlig von der Realität entkoppelt. Dieses Ergebnis zeigt eindringlich, wie sehr verfestigte Vorstellungen das Weltbild verzerren – und wie wertvoll es sein kann, sie zu überdenken.',
          },
          '96_100': {
            withIdentity:
              '{{name}} ({{age}} Jahre), dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            withoutIdentity:
              'Dein gemessener Bias beträgt {{percent}} % in Richtung {{biasDirection}}.',
            body: 'Zwischen deiner Wahrnehmung und den realen Daten besteht maximale Differenz. Stark eingeprägte Annahmen haben dein Bild vollständig bestimmt – ein Weckruf, diese Vorstellungen kritisch zu beleuchten und gegebenenfalls neu zu formen.',
          },
        },
      },
      printResults: {
        noResults: 'Keine Ergebnisse zum Drucken.',
        backHome: 'Zurück zur Startseite',
      },
      printTest: {
        title: 'Drucktest',
        results: 'Ergebnisse',
        home: 'Startseite',
        instructions:
          'JSON im Format {"lines":[{"points":[0..100]}...]} mit 13 Zeilen einfügen.',
        loadDemoData: 'Demo-Daten laden',
        randomizeData: 'Daten zufällig erzeugen',
        printPage: 'Seite drucken',
        refreshPreview: 'Vorschau aktualisieren',
        invalidJson: 'Ungültiges JSON: {{message}}',
      },
      presenter: {
        header: 'Präsentation',
        loading: 'Live-Ergebnisse werden geladen...',
      },
      errors: {
        supabaseNotConfigured: 'Supabase ist nicht konfiguriert.',
        fetchResultsFailed:
          'Live-Ergebnisse konnten nicht geladen werden: {{message}}',
      },
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
})

export default i18n
