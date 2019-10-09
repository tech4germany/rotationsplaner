import {
  Category,
  DienstorteLink,
  DienstpostenAuswahl,
  Preference,
  PreferenceCategory,
  Task
} from "../classes/Checklist";


export default class MockData {

  public static categories: Category[] = [
    new Category(
      'Umzug',
      [
        new Task(
          1,
          'Speditionen anfragen',
          false,
          false,
          'Umzug'
        ),
        new Task(
          2,
          'WBR beantragen',
          false,
          false,
          'Umzug',
          'Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.',
          '<a href="http://forms.diplo.com">WBR-Formular</a>'
        ),
        new Task(
          3,
          'Haustier einpacken',
          false,
          false,
          'Umzug',
          'Dies ist nur ein Beispiel. Bitte nicht wirklich machen!',
          '<a href="http://forms.diplo.com">WBR-Formular</a>',
          undefined,
          undefined,
          'Haustiere'
        )
      ]
    ),
    new Category(
      'Wohnung',
      [
        new Task(
          11,
          'Maklertermine vereinbaren',
          false,
          false,
          'Wohnung'
        ),
        new Task(
          12,
          'Mietspiegel überprüfen',
          false,
          false,
          'Wohnung'
        )
      ]
    ),
    new Category(
      'Testing',
      [
        new Task(
          21,
          'Nur für Zielposten',
          false,
          false,
          'Testing',
          undefined,
          undefined,
          '<a href="about:blank">blanko</a>',
          undefined,
          'DestinationPostTag'
        ),
        new Task(
          22,
          'Hier kommt ein sehr langer Titel mit viel, viel Text, der evtl. den Rahmen sprengt.' +
          'Theoretisch können hier endlos viele Zeilen hin.' +
          '\nVielleicht sogar ein Zeilenumbruch???',
          false,
          false,
          'Testing',
          undefined,
          'Hier kommt ein sehr langer Titel mit viel, viel Text, der evtl. den Rahmen sprengt.' +
        'Theoretisch können hier endlos viele Zeilen hin.',
          '<a href="about:blank">blanko</a>',
          undefined,
          'DestinationPostTag'
        )
      ]
    )
    ];

  public static preferences: Preference[] = [
      {name: 'partner', description: 'Partner_in', checked: true, category: PreferenceCategory.dependents},
      {name: 'children_younger', description: 'Jüngere Kinder', checked: false, category: PreferenceCategory.dependents},
      {name: 'children_school', description: 'Schulpflichtige Kinder', checked: false, category: PreferenceCategory.dependents},
      {name: 'children_higher_ed', description: 'Studierende Kinder', checked: false, category: PreferenceCategory.dependents},
      {name: 'familymembers_other', description: 'Sonstige Familienangehörige', checked: false, category: PreferenceCategory.dependents},
      {name: 'household_full', description: 'Gesamter Haushalt', checked: false, category: PreferenceCategory.items},
      {name: 'household_partial', description: 'Nur Teile des Haushalts', checked: true, category: PreferenceCategory.items},
      {name: 'vehicles', description: 'Fahrzeuge', checked: false, category: PreferenceCategory.items},
      {name: 'Haustiere', description: 'Haustiere', checked: true, category: PreferenceCategory.items},
    ];

  public static infoData: DienstorteLink[] = [
      {title: 'Lebensbedingungsbericht', location: 'Pretoria', url: 'http://www.google.com', dienstortId: 1, id: 1},
      {title: 'Auslandsvertretung', location: 'Pretoria', url: 'https://southafrica.diplo.de/sa-de/sa-vertretungen/sa-botschaft', dienstortId: 1, id: 2},
      {title: 'Willkommensmappe', location: 'Pretoria', url: 'http://www.google.com', dienstortId: 1, id: 3}
    ];

  public static posts = new DienstpostenAuswahl(undefined, {id: 0, title: 'Pretoria', tags: ['DestinationPostTag']});

}
