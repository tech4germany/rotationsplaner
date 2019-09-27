import {Category, Preference, PreferenceCategory, Task} from '../classes/Checklist';
import {ItemAddResult, List, sp} from '@pnp/sp';
import IWebPartContext from '@microsoft/sp-webpart-base/lib/core/IWebPartContext';
import MockData from './MockData';


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
      return Promise.resolve(MockData.getCategories());
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

    const parseTask = (task) : Task => {
      return new Task({
        id: task.ID,
        name: task.Title,
        detailText: task.Beschreibung,
        links: [/*task.Links*/],
        pointOfContact: task.AuthorId,
        showOnlyFor: task.Labels,
        isCustom: false,
      }, false, false, null);  // ToDo: extract isArchived from backend
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
        isCustom: true
      }, t.Checked,  false,null); // ToDo: extract isArchived from backend
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
      return delay(500).then(() => Promise.resolve(MockData.getPreferences()));
    }

    const globalPrefs = await this.fetchGlobalPreferences();
    const userPrefs = await this.fetchUserPreferences();

    return this.mergePrefs(globalPrefs, userPrefs);
  }

  public static postPreferences(preferences: Preference[]): Promise<void> {
    return Promise.resolve();
  }

  public static async createTask(taskTitle: string, category: string): Promise<ItemAddResult> {
    console.log('adding Task for category ' + category);

    return sp.web.lists.getByTitle('CustomTasks').items.add({
          Title: taskTitle,
          Beschreibung: 'This is a custom created Task',
          Category: category,
          // Author: currentUser.Id // Automatically assigned?
        });
  }

  private static async upsert(payload: any, list: List, existingItemFilter: string) {
    const existingItemQuery = await list.items
      .filter(existingItemFilter)
      .select('Id')
      .top(1).get();

    const itemExists = existingItemQuery.length > 0;
    if(itemExists) {
      const idForUpdate = existingItemQuery[0].Id;
      return list.items.getById(idForUpdate).update(payload);
    } else {
      return list.items.add(payload);
    }
  }

  public static async saveTaskProgress(task: Task): Promise<ItemAddResult> {
    const list = sp.web.lists.getByTitle('TaskProgress');
    const taskId = task.description.id;
    // ToDo: add archive attribute
    const payload = {TaskId: taskId, Checked: task.checked};

    return this.upsert(payload, list, `Task eq ${taskId}`);
  }

  public static postCategory(category: Category): Promise<void> {
    console.log('adding a new category');
    return Promise.resolve();
  }

  public static fetchInfoData() : Promise<any> {
    return Promise.resolve(MockData.getInfoData());
  }
}
