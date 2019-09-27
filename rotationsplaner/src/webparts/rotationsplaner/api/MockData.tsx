import {Category, Preference, PreferenceCategory, Task} from "../classes/Checklist";


export default class MockData {

  public static getCategories() : Category[] {
    const umzug: Category = {
      name: 'Umzug',
      tasks: [
        new Task({
          id: '1',
          name: 'Speditionen anfragen',
          isCustom: false,
          detailText: 'Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können'
        }, false, false,undefined),
        new Task({
          id: '2',
          name: 'WBR beantragen',
          detailText: 'Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.',
          isCustom: false,
          links: [{description: 'WBR Formular', uri: 'http://forms.diplo.com'}]
        }, false, false, undefined),
        new Task({
          id: '3',
          name: 'Haustier einpacken',
          detailText: 'Dies ist nur ein Beispiel. Bitte nicht wirklich machen!',
          isCustom: false,
          links: [{description: 'WBR Formular', uri: 'http://forms.diplo.com'}],
          showOnlyFor: 'Haustiere'
        }, false, false, undefined)
      ]
    };
    const wohnung: Category = {
      name: 'Wohnung',
      tasks: [
        new Task({
          id: 'w1',
          name: 'Maklertermine vereinbaren',
          isCustom: false,
        }, false, false, undefined),
        new Task({
            id: 'w2',
            name: 'Mietspiegel überprüfen',
            isCustom: false,
            links: []
          },
          false, false, undefined)
      ]
    };

    return [umzug, wohnung];
  }

  public static getPreferences() : Preference[] {
    const defaultPreferences: Array<Preference> = [ // TODO move to backend
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

    return defaultPreferences;
  }

  public static getInfoData() {
    const infoTiles = [
      {primaryText: 'Lebensbedingungsbericht', secondaryText: 'Wissenswertes zu Pretoria', link: 'http://www.google.com'},
      {primaryText: 'Auslandsvertretung', secondaryText: 'Deutsche Vertretung in Pretoria', link: 'https://southafrica.diplo.de/sa-de/sa-vertretungen/sa-botschaft'},
      {primaryText: 'Willkommensmappe', secondaryText: 'Ankommen in Pretoria', link: 'http://www.google.com'}
    ];

    return infoTiles;
  }

}


