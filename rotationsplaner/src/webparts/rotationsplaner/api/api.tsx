import {Category, Preference, PreferenceCategory, Task} from "../classes/Checklist";
import {ItemAddResult, sp} from "@pnp/sp";
import IWebPartContext from "@microsoft/sp-webpart-base/lib/core/IWebPartContext";


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
  private static isDev = false;
  public static init(context: IWebPartContext) {
    if (context.pageContext.web.title == 'Local Workbench')
      this.isDev = true;
    sp.setup({
      spfxContext: context
    });
  }


  public static fetchTask(): Promise<Task[]> {
    return Promise.resolve([]);
  }

  public static fetchCategories(): Promise<Category[]> {
    if(this.isDev) {
      return Promise.resolve(categories);
    }

    return sp.web.lists.getByTitle('Tasks').items
      // bt3a --> Kategorie
      .select('Title', 'bt3a', 'ID', 'Beschreibung', 'AuthorId', 'Labels', /*'Links'*/)
      .get()
      .then(this.extractCategories)
      .then(this.addCustomTasks);
  }

  private static extractCategories(tasks): Category[] {

    const categories = tasks
      .map((t) => t.bt3a)
      .filter((value, index, self) => self.indexOf(value) === index)

    const categoryMap = {};

    const parseTask = (task) : Task => {
      return new Task({
        id: task.ID,
        name: task.Title,
        detailText: task.Beschreibung,
        links: [/*task.Links*/],
        pointOfContact: task.AuthorId,
        showOnlyFor: task.Labels,
        isCustom: false,
      }, false, null);
    };

    tasks.forEach(t => {
      if(!categoryMap[t.bt3a]) {
        categoryMap[t.bt3a] = [];
      }

      categoryMap[t.bt3a].push(parseTask(t));
    });

    return categories.map(k => ({
        name: k,
        tasks: categoryMap[k]
      })
    );
  }

  private static async addCustomTasks(categories: Category[]) : Promise<Category[]> {
    const currentUser = await sp.web.currentUser.get();

    const parseCustomTask = (t: any) : Task => {
      return new Task({
        id: t.ID,
        name: t.Title,
        detailText: t.Beschreibung,
        links: [],
        isCustom: true,
      }, t.Checked, null)
    };

    return sp.web.lists.getByTitle('CustomTasks').items
      .filter(`AuthorId eq ${currentUser.Id}`)
      .select('ID', 'Title', 'Beschreibung', 'Category', 'AuthorId', 'Checked')
      .get()
      .then(tasks => {
        tasks.forEach(t => {
          const index = categories.map(c => c.name).indexOf(t.Category);
          console.info('Adding custom task to category - ' + t.Category);
          categories[index].tasks.push(parseCustomTask(t));
        });

        return categories;
      });
  }

  /**
   * Fetch all preferences (checked/unchecked) made by the current user and add them to the preferences instances
   */
  private static async mergePrefs(globalPreferences: Preference[], userPreferences: any): Promise<Preference[]> {
    let userPreferencesMap: { [id: string] : any; } = {};
    userPreferences.forEach(p => userPreferencesMap[p.Title] = p);

    return globalPreferences.map(p => {
      p.checked = userPreferencesMap[p.name] && userPreferencesMap[p.name].Checked || false;
      return p;
    });
  }

  private static fetchGlobalPreferences(): Promise<Preference[]> {
    return sp.web.lists.getByTitle('Preferences').items.get()
      .then((response: any[]) => {
        return response.map(r => new Preference(r));
      });
  }

  private static async fetchUserPreferences(): Promise<Preference[]> {
    const currentUser = await sp.web.currentUser.get();
    return sp.web.lists.getByTitle('UserPreferences').items
      .filter(`AuthorId eq ${currentUser.Id}`)
      .select('Title', 'Checked')
      .get();
  }

  public static async fetchPreferences(): Promise<Preference[]> {
    if(this.isDev) {
      return delay(500).then(() => Promise.resolve(defaultPreferences));
    }

    const globalPrefs = await this.fetchGlobalPreferences();
    const userPrefs = await this.fetchUserPreferences();

    return this.mergePrefs(globalPrefs, userPrefs);
  }

  public static postPreferences(preferences: Preference[]): Promise<void> {
    return Promise.resolve();
  }

  public static async createTask(taskTitle: string, category: string): Promise<ItemAddResult> {
    console.log("adding Task for category " + category);

    return sp.web.lists.getByTitle('CustomTasks').items.add({
          Title: taskTitle,
          Beschreibung: 'This is a custom created Task',
          Category: category,
          // Author: currentUser.Id // Automatically assigned?
        });
  }

  public static postCategory(category: Category): Promise<void> {
    console.log('adding a new category');
    return Promise.resolve();
  }
}
