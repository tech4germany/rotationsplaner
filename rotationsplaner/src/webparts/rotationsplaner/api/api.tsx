import {Category, CustomTask, Preference, Task} from '../classes/Checklist';
import {ItemAddResult, ItemUpdateResult, List, sp} from '@pnp/sp';
import IWebPartContext from '@microsoft/sp-webpart-base/lib/core/IWebPartContext';
import MockData from './MockData';


function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), millis));
}

export default class Api {
  private static isDev = false;
  private static currentUser: any;

  public static async init(context: IWebPartContext): Promise<void> {
    if (context.pageContext.web.title == 'Local Workbench')
      this.isDev = true;
    sp.setup({
      spfxContext: context
    });
    if (!this.isDev) {
      this.currentUser = await sp.web.currentUser.get();
    }
  }

  public static async fetchCategories(): Promise<Category[]> {
    if(this.isDev) {
      return Promise.resolve(MockData.categories);
    }

    const tasks = await this.fetchTasks();
    const categories = this.extractCategories(tasks);
    return this.addCustomTasks(categories);
  }

  private static async fetchTasks() {
    const tasksData = await sp.web.lists.getByTitle('Tasks').items
      .select('Title', 'bt3a' /* = Kategorie */, 'ID', 'Beschreibung', 'AuthorId', 'Labels', /*'Links'*/)
      .get();

    const tasks: Task[] = tasksData.map(Task.deserializeTask);
    return this.fetchAndAddProgress(tasks);
  }

  private static async fetchAndAddProgress(tasks: Task[]) {
    const list = sp.web.lists.getByTitle('TaskProgress');
    const progressData = await list.items
      .select('TaskId', 'Checked', 'Archived')
      .filter(`AuthorId eq ${this.currentUser.Id}`)
      .get();
    const taskMap = new Map<number, Task>(
      tasks.map(t => [t.id, t] as [number, Task])
    );
    progressData.forEach(p => {
      const task = taskMap.get(p.TaskId);
      if (!task) {
        console.error('no task for progress', p);
      } else {
        task.checked = p.Checked;
        task.isArchived = p.Archived;
      }
    });
    return tasks;
  }

  private static extractCategories(tasks: Task[]): Category[] {

    const categories = tasks
      .map((t) => t.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    const categoryMap = {};

    tasks.forEach(t => {
      if(!categoryMap[t.category]) {
        categoryMap[t.category] = [];
      }

      categoryMap[t.category].push(t);
    });

    return categories.map(k => ({
        name: k,
        tasks: categoryMap[k]
      })
    );
  }

  private static async addCustomTasks(categories: Category[]) : Promise<Category[]> {

    const tasksData = await sp.web.lists.getByTitle('CustomTasks').items
      .filter(`AuthorId eq ${this.currentUser.Id}`)
      .select('ID', 'Title', 'Beschreibung', 'Category', 'AuthorId', 'Checked')
      .get();

    const tasks = tasksData.map(d => new CustomTask(d));
    tasks.forEach(t => {
      const index = categories.map(c => c.name).indexOf(t.category);
      if (index !== -1) {
        categories[index].tasks.push(t);
      } else {
        categories.push({name: t.category, tasks: [t]});
      }
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
      return delay(500).then(() => Promise.resolve(MockData.preferences));
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

  public static fetchInfoData() : Promise<any> {
    return Promise.resolve(MockData.infoData);
  }
}
