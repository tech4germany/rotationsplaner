import {Category, CustomTask, Preference, Task} from '../classes/Checklist';
import {sp} from '@pnp/sp';
import IWebPartContext from '@microsoft/sp-webpart-base/lib/core/IWebPartContext';
import MockData from './MockData';
import TasksApi from './TasksApi';
import Utilities from "./Utilities";


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

    const tasks = await TasksApi.fetchTasks(this.currentUser.Id);
    const customTasks = await TasksApi.fetchCustomTasks(this.currentUser.Id);
    const categories = this.extractCategories(tasks);
    return this.mergeTasks(customTasks, categories);
  }

  private static mergeTasks(customTasks: CustomTask[], categories: Category[]) {
    customTasks.forEach(t => {
      const index = categories.map(c => c.name).indexOf(t.category);
      if (index !== -1) {
        categories[index].tasks.push(t);
      } else {
        categories.push({name: t.category, tasks: [t]});
      }
    });

    return categories;
  }

  public static async saveProgress(task: Task | CustomTask): Promise<void> {
    if(task instanceof Task) {
      await TasksApi.saveTaskProgress(task);
    } else {
      await TasksApi.saveCustomTask(task);
    }
  }

  public static async deleteCustomTask(task: CustomTask) : Promise<void> {
    return TasksApi.deleteCustomTask(task);
  }

  public static async fetchPreferences(): Promise<Preference[]> {
    if(this.isDev) {
      // return Promise.reject('Verbindung zu Sharepoint konnte nicht hergestellt werden...');
      return delay(500).then(() => Promise.resolve(MockData.preferences));
    }

    const globalPrefs = await this.fetchGlobalPreferences();
    const userPrefs = await this.fetchUserPreferences();

    return this.mergePrefs(globalPrefs, userPrefs);
  }

  public static postPreferences(preferences: Preference[]): Promise<void> {
    return Promise.resolve();
  }


  public static postCategory(category: Category): Promise<void> {
    console.log('adding a new category');
    return Promise.resolve();
  }

  public static fetchInfoData() : Promise<any> {
    return Promise.resolve(MockData.infoData);
  }

  public static async deleteAllUserData(): Promise<void> {
    const listNames = ['CustomTasks', 'UserPreferences', 'TaskProgress'];
    const lists = listNames.map(t => sp.web.lists.getByTitle(t));
    const promises = lists.map(l => Utilities.deleteAllCreatedByUser(this.currentUser.Id, l));
    await Promise.all(promises);
  }





  /***************** Private Methods ***************/





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
}
