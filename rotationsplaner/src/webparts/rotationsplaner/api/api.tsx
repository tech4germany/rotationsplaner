import {Category, Preference, PreferenceCategory, Task} from "../classes/Checklist";
import {sp} from "@pnp/sp";


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
      showOnlyFor: 'Haustiere'
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
  {name: 'Haustiere', description: 'Haustiere', checked: true, category: PreferenceCategory.items},
];

function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), millis));
}

export default class Api {

  public static init(context: any) {
    // const sharepointUrl = 'http://sharepoint-is-live.com';
    // const clientId = '42';
    // const clientSecret = 'Not42';

    sp.setup({
      spfxContext: context
    });
  }


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

  /**
   * Fetch all preferences (checked/unchecked) made by the current user and add them to the preferences instances
   */
  private static async addCheckedStatus(preferences: Preference[]): Promise<Preference[]> {
    let preferencesByName: { [id: string] : Preference; } = {};
    preferences.forEach(p => preferencesByName[p.name] = p);
    const currentUser = await sp.web.currentUser.get();
    const userPreferences = await sp.web.lists.getByTitle('UserPreferences').items
      .filter(`AuthorId eq ${currentUser.Id}`)
      .select('Title', 'Checked')
      .get();
    userPreferences.forEach(up => {
      const key = up.Title;
      if (!preferencesByName.hasOwnProperty(key)) {
        console.warn(`User preference ${key} not found in preferences!`);
        return;
      }
      preferencesByName[key].checked = up.Checked;
    });
    return preferences;
  }

  public static fetchPreferences(): Promise<Preference[]> {
    return sp.web.lists.getByTitle('Preferences').items.get()
      .then((response: any[]) => {
        console.log(response);
        return response.map(r => new Preference(r));
      })
      .then(this.addCheckedStatus);
    //return delay(500).then(() => Promise.resolve(defaultPreferences));
  }

  public static postPreferences(preferences: Preference[]): Promise<void> {
    return Promise.resolve();
  }
}
