import {Category, Preference, PreferenceCategory, Task} from "../classes/Checklist";


export default class MockData {

  public static categories: Category[] = [
    {
      name: 'Umzug',
      tasks: [
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
    },
    {
      name: 'Wohnung',
      tasks: [
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
    }
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

  public static infoData = [
      {primaryText: 'Lebensbedingungsbericht', secondaryText: 'Wissenswertes zu Pretoria', link: 'http://www.google.com'},
      {primaryText: 'Auslandsvertretung', secondaryText: 'Deutsche Vertretung in Pretoria', link: 'https://southafrica.diplo.de/sa-de/sa-vertretungen/sa-botschaft'},
      {primaryText: 'Willkommensmappe', secondaryText: 'Ankommen in Pretoria', link: 'http://www.google.com'}
    ];

}
