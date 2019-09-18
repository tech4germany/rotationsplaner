import {Category, Preference, PreferenceCategory, Task} from "../classes/Checklist";

const sharepointUrl = 'http://sharepoint-is-live.com';
const clientId = '42';
const clientSecret = 'Not42';

// configure your node options (only once in your application)
// sp.setup({
//   sp: {
//     fetchClientFactory: () => {
//       return new SPFetchClient(sharepointUrl, clientId, clientSecret);
//     },
//   },
// });

const umzug: Category = {
  name: 'Umzug',
  tasks: [
    new Task({
      id: "1",
      name: "Speditionen anfragen",
      isCustom: false,
      detailText: "Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können"
    }, false, undefined),
    new Task({
      id: "2",
      name: "WBR beantragen",
      detailText: "Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.",
      isCustom: false,
      links: [{description: "WBR Formular", uri: "http://forms.diplo.com"}]
    }, false, undefined),
    new Task({
      id: "3",
      name: "Haustier einpacken",
      detailText: "Dies ist nur ein Beispiel. Bitte nicht wirklich machen!",
      isCustom: false,
      links: [{description: "WBR Formular", uri: "http://forms.diplo.com"}],
      showOnlyFor: 'pets'
    }, false, undefined)
  ]
};
const wohnung: Category = {
  name: 'Wohnung',
  tasks: [
    new Task({
      id: "w1",
      name: "Maklertermine vereinbaren",
      isCustom: false,
    }, false, undefined),
    new Task({
        id: "w2",
        name: "Mietspiegel überprüfen",
        isCustom: false,
        links: []
      },
      false, undefined)
  ]
};

const categories = [umzug, wohnung];

const defaultPreferences: Array<Preference> = [ // TODO move to backend
  {name: 'partner', description: 'Partner_in', checked: true, category: PreferenceCategory.dependents},
  {name: 'children_younger', description: 'Jüngere Kinder', checked: false, category: PreferenceCategory.dependents},
  {name: 'children_school', description: 'Schulpflichtige Kinder', checked: false, category: PreferenceCategory.dependents},
  {name: 'children_higher_ed', description: 'Studierende Kinder', checked: false, category: PreferenceCategory.dependents},
  {name: 'familymembers_other', description: 'Sonstige Familienangehörige', checked: false, category: PreferenceCategory.dependents},
  {name: 'household_full', description: 'Gesamter Haushalt', checked: false, category: PreferenceCategory.items},
  {name: 'household_partial', description: 'Nur Teile des Haushalts', checked: true, category: PreferenceCategory.items},
  {name: 'vehicles', description: 'Fahrzeuge', checked: false, category: PreferenceCategory.items},
  {name: 'pets', description: 'Haustiere', checked: true, category: PreferenceCategory.items},
];

function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), millis));
}

export default class Api {

  public static fetchTask(): Promise<Task[]> {
    return Promise.resolve([]);
  }

  public static fetchCategories(): Promise<Category[]> {

    // make a call to SharePoint and log it in the console
    // sp.web.select("Title", "Description").get().then(w => {
    //   console.log(JSON.stringify(w, null, 4));
    // });

    return Promise.resolve(categories);
  }

  public static fetchPreferences(): Promise<Preference[]> {
    return delay(500).then(() => Promise.resolve(defaultPreferences));
  }

}
