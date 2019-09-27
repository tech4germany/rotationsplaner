import {Category, CustomTask, Preference, PreferenceCategory, Task} from '../classes/Checklist';
import {ItemAddResult, ItemUpdateResult, List, sp} from '@pnp/sp';
import IWebPartContext from '@microsoft/sp-webpart-base/lib/core/IWebPartContext';

const umzug: Category = {
  name: 'Umzug',
  tasks: [
    new Task(
      1,
      'Speditionen anfragen',
      false,
      false,
    ),
    new Task(
      2,
      'WBR beantragen',
      false,
      false,
      'Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.',
      [{description: 'WBR Formular', uri: 'http://forms.diplo.com'}]
    ),
    new Task(
      3,
      'Haustier einpacken',
      false,
      false,
      'Dies ist nur ein Beispiel. Bitte nicht wirklich machen!',
      [{description: 'WBR Formular', uri: 'http://forms.diplo.com'}],
      undefined,
      'Haustiere'
      )
  ]
};
const wohnung: Category = {
  name: 'Wohnung',
  tasks: [
    new Task(
      11,
      'Maklertermine vereinbaren',
      false,
      false
    ),
    new Task(
      12,
      'Mietspiegel überprüfen',
      false,
      false
    )
  ]
};

const defaultCategories = [umzug, wohnung];

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
      return Promise.resolve(defaultCategories);
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
      .filter((value, index, self) => self.indexOf(value) === index);

    const categoryMap = {};

    const parseTask = (data: any) : Task => {
      return new Task(
        data.ID,
        data.Title,
        undefined,
        undefined, // ToDo: extract isArchived from backend
        data.Beschreibung,
        [/*task.Links*/],
        undefined,
        data.Labels
      );
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

    const tasksData = await sp.web.lists.getByTitle('CustomTasks').items
      .filter(`AuthorId eq ${currentUser.Id}`)
      .select('ID', 'Title', 'Beschreibung', 'Category', 'AuthorId', 'Checked')
      .get();

      tasksData.forEach(t => {
        const index = categories.map(c => c.name).indexOf(t.Category);
        console.info('Adding custom task to category - ' + t.Category);
        categories[index].tasks.push(new CustomTask(t));
      });

      return categories;
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

  public static async saveCustomTask(task: CustomTask): Promise<CustomTask> {
    const list = sp.web.lists.getByTitle('CustomTasks');
    if (task.id !== undefined)  {
      const result = await this.update(task.id, task.serialize(), list);
      return new CustomTask(result.data);
    }
    const payload = task.serialize();
    const result = await this.add(payload, list);
    console.info('saveCustomTask', result);
    return new CustomTask(result.data);
  }

  private static async upsert(payload: any, list: List, existingItemFilter: string) {
    const existingItemQuery = await list.items
      .filter(existingItemFilter)
      .select('Id')
      .top(1).get();

    const itemExists = existingItemQuery.length > 0;
    if(itemExists) {
      const idForUpdate = existingItemQuery[0].Id;
      return this.update(idForUpdate, payload, list);
    } else {
      return this.add(payload, list);
    }
  }

  private static update(id: any, payload: any, list: List): Promise<ItemUpdateResult> {
    return list.items.getById(id).update(payload);
  }

  private static add(payload: any, list: List): Promise<ItemAddResult> {
    return list.items.add(payload);
  }

  public static async saveProgress(task: Task | CustomTask): Promise<void> {
    if(task instanceof Task) {
      await this.saveTaskProgress(task);
    } else {
      await this.saveCustomTask(task);
    }
  }


  private static async saveTaskProgress(task: Task) {
    const list = sp.web.lists.getByTitle('TaskProgress');
    const payload = {TaskId: task.id, Checked: task.checked, Archived: task.isArchived};
    await this.upsert(payload, list, `Task eq ${task.id}`);
  }

  public static postCategory(category: Category): Promise<void> {
    console.log('adding a new category');
    return Promise.resolve();
  }
}
