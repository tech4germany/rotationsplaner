import {
  Category,
  CategoryDto,
  Contact,
  CustomTask,
  DienstorteLink,
  Preference,
  PreferenceCategory,
  Task,
  UserDienstorte
} from "../classes/Checklist";


export default class MockData {

  public static umzugCategoryDto = new CategoryDto('Umzug', 10);
  public static wohnungCategoryDto = new CategoryDto('Wohnung', 20);
  public static testingCategoryDto = new CategoryDto('Testing', 15);

  public static categories: Category[] = [
    new Category(
      'Umzug',
      MockData.umzugCategoryDto.sortingKey,
      [
        new Task(
          1,
          'Speditionen anfragen',
          false,
          false,
          MockData.umzugCategoryDto,
        ),
        new Task(
          2,
          'WBR beantragen',
          false,
          false,
          MockData.umzugCategoryDto,
          'Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.',
          '<a href="http://forms.diplo.com">WBR-Formular</a>'
        ),
        new Task(
          3,
          'Haustier einpacken',
          false,
          false,
           MockData.umzugCategoryDto,
          'Dies ist nur ein Beispiel. Bitte nicht wirklich machen!',
          '<a href="http://forms.diplo.com">WBR-Formular</a>',
          undefined,
          [new Contact('Team Tech4Germany', 1)],
          'Haustiere'
        ),
        new CustomTask('Klavier verkaufen', 'Umzug', false, true)
      ]
    ),
    new Category(
      'Wohnung',
      MockData.wohnungCategoryDto.sortingKey,
      [
        new Task(
          11,
          'Maklertermine vereinbaren',
          false,
          false,
          MockData.wohnungCategoryDto
        ),
        new Task(
          12,
          'Mietspiegel überprüfen',
          false,
          false,
          MockData.wohnungCategoryDto
        )
      ]
    ),
    new Category(
      'Testing',
      MockData.testingCategoryDto.sortingKey,
      [
        new Task(
          21,
          'Nur für Zielposten',
          false,
          false,
          MockData.testingCategoryDto,
          undefined,
          undefined,
          '<a href="about:blank">blanko</a>',
          undefined,
          'DestinationPostTag'
        ),
        new Task(
          22,
          'Hier kommt ein sehr langer Titel mit viel, viel Text, der evtl. den Rahmen sprengt. ' +
          'Theoretisch können hier endlos viele Zeilen hin.' +
          '\nVielleicht sogar ein Zeilenumbruch??? Oder einfach noch ein bisschen Text. Mal sehen.',
          false,
          false,
          MockData.testingCategoryDto,
          undefined,
          'Hier kommt ein sehr langer Titel mit viel, viel Text, der evtl. den Rahmen sprengt. ' +
        'Theoretisch können hier endlos viele Zeilen hin.',
          '<a href="about:blank">blanko</a>',
          undefined,
          'DestinationPostTag'
        )
      ]
    )
    ];

  public static preferences: Preference[] = [
      {name: 'Partner_in', checked: true, category: PreferenceCategory.dependents},
      {name: 'Jüngere Kinder', checked: false, category: PreferenceCategory.dependents},
      {name: 'Schulpflichtige Kinder', checked: false, category: PreferenceCategory.dependents},
      {name: 'Studierende Kinder', checked: false, category: PreferenceCategory.dependents},
      {name: 'Sonstige Familienangehörige', checked: false, category: PreferenceCategory.dependents},
      {name: 'Gesamter Haushalt', checked: false, category: PreferenceCategory.items},
      {name: 'Nur Teile des Haushalts', checked: true, category: PreferenceCategory.items},
      {name: 'Fahrzeuge', checked: false, category: PreferenceCategory.items},
      {name: 'Haustiere', checked: true, category: PreferenceCategory.items},
    ];

  public static infoData: DienstorteLink[] = [
      {title: 'Lebensbedingungsbericht', location: 'Pretoria', url: 'http://www.google.com', dienstortId: 1, id: 1},
      {title: 'Auslandsvertretung', location: 'Pretoria', url: 'https://southafrica.diplo.de/sa-de/sa-vertretungen/sa-botschaft', dienstortId: 1, id: 2},
      {title: 'Willkommensmappe', location: 'Pretoria', url: 'http://www.google.com', dienstortId: 1, id: 3},
    {title: 'Willkommensmappe', location: 'Pretoria', url: 'http://www.google.com', dienstortId: 1, id: 4},
    {title: 'Willkommensmappe', location: 'Pretoria', url: 'http://www.google.com', dienstortId: 1, id: 5}
    ];

  public static posts = new UserDienstorte(undefined, {id: 0, title: 'Pretoria', tags: ['DestinationPostTag']});

}
