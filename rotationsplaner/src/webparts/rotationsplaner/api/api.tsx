import {
  AnyTask,
  Category,
  CustomTask,
  DienstorteLink,
  Dienstposten,
  Preference,
  Task,
  UserDienstorte
} from '../classes/Checklist';
// Internet Explorer polyfills BY pnp required FOR pnp because why not
import "@pnp/polyfill-ie11";
import {sp} from '@pnp/sp';
import {IWebPartContext} from '@microsoft/sp-webpart-base';
import MockData from './MockData';
import TasksApi from './TasksApi';
import PreferenceApi from './PreferenceApi';
import Utilities from "./Utilities";


function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), millis));
}

export default class Api {
  public static currentUser: any;
  public static isDev: boolean = false;

  public static async init(context: IWebPartContext): Promise<void> {
    if (context.pageContext.web.title === 'Local Workbench')
      this.isDev = true;
    sp.setup({
      spfxContext: context
    });
    if (!this.isDev) {
      this.currentUser = await sp.web.currentUser.get();
    } else {
      this.currentUser = {Id: 'PlaceholderId'};
    }
  }


  /*
  *
  * **************** Tasks ******************
  *
  * */

  public static async fetchCategories(posts?: UserDienstorte): Promise<Category[]> {
    if (this.isDev) {
      return Promise.resolve(MockData.categories);
    }

    const tasks: Task[] = await TasksApi.fetchTasks(this.currentUser.Id, posts);
    const customTasks: CustomTask[] = await TasksApi.fetchCustomTasks(this.currentUser.Id);
    const categories: Category[] = this.extractCategories(tasks);
    return this.mergeTasks(customTasks, categories);
  }

  private static mergeTasks(customTasks: CustomTask[], categories: Category[]): Category[] {
    customTasks.forEach(task => {
      this.insertTaskIntoCategories(task, categories);
    });

    return categories;
  }

  private static insertTaskIntoCategories(task: AnyTask, categories: Category[]) {
    const index = categories.map(c => c.name).indexOf(task.category.name);
    if (index !== -1) {
      categories[index].tasks.push(task);
    } else {
      // create new category
      categories.push(new Category(task.category.name, task.category.sortingKey, [task]));
    }
  }

  public static async fetchAdditionalTasks(existing: Category[], posts?: UserDienstorte) {
    if (!posts || !posts.destination) {
      return existing;
    }
    const tasks = await TasksApi.fetchAdditionalTasks(this.currentUser.Id, posts.destination);
    console.log('fetched additional tasks', tasks);
    existing.forEach(category => this.removeLocationSpecificTasks(category));
    tasks.forEach(t => this.insertTaskIntoCategories(t, existing));
    console.log('merged tasks', existing);
    return existing;
  }

  private static removeLocationSpecificTasks(category) {
    category.tasks = category.tasks.filter(t => t instanceof CustomTask || t.showOnlyForLocation === undefined);
  }

  public static saveProgress(task: AnyTask): Promise<Task | CustomTask> {
    if (task instanceof Task) {
      return TasksApi.saveTaskProgress(task);
    } else {
      return TasksApi.saveCustomTask(task);
    }
  }

  public static async deleteCustomTask(task: CustomTask) : Promise<void> {
    return TasksApi.deleteCustomTask(task);
  }

  /*
  *
  * **************** Preferences ******************
  *
  * */

  public static async fetchPreferences(): Promise<Preference[]> {
    if (this.isDev) {
      // return Promise.reject('Verbindung zu Sharepoint konnte nicht hergestellt werden...');
      return delay(500).then(() => Promise.resolve(MockData.preferences));
    }

    return PreferenceApi.fetchPreferences();
  }

  public static postCategory(category: Category): Promise<void> {
    console.log('adding a new category');
    return Promise.resolve();
  }

  public static async fetchInfoData(zielOrtId: number): Promise<DienstorteLink[]> {
    if (this.isDev) {
      return Promise.resolve(MockData.infoData);
    }

    const list = sp.web.lists.getByTitle('Dienstorte Links');
    const items = await list.items
      .filter(`Dienstort/Id eq ${zielOrtId}`)
      .select('Dienstort/Id', 'Dienstort/Location', 'URL', 'ID')
      .expand('Dienstort')
      .get();

    return items.map(DienstorteLink.deserialize);
  }

  public static async deleteAllUserData(): Promise<void> {
    const listNames = ['UserCustomTasks', 'UserPreferences', 'UserTaskProgress', 'UserDienstorte'];
    const lists = listNames.map(t => sp.web.lists.getByTitle(t));
    const promises = lists.map(l => Utilities.deleteAllCreatedByUser(this.currentUser.Id, l));
    await Promise.all(promises);
  }





  /*
   *
   *  **************** Dienstposten ******************
   *
   */

  public static async fetchPosts(): Promise<Dienstposten[]> {
    const list = sp.web.lists.getByTitle('Dienstorte');
    const items = await list.items
      .select('Bedingungen/Title', 'Title', 'Id')
      .expand('Bedingungen')
      .getAll();
    return items.map(Dienstposten.deserialize);
  }

  public static async fetchSinglePost(id: number): Promise<Dienstposten> {
    const list = sp.web.lists.getByTitle('Dienstorte');
    const data = await list.items.getById(id)
      .select('Bedingungen/Title', 'Title', 'Id')
      .expand('Bedingungen')
      .get();
    return Dienstposten.deserialize(data);
  }

  public static async fetchUserPosts(): Promise<UserDienstorte> {
    if (this.isDev) {
      return Promise.resolve(MockData.posts);
    }

    const list = sp.web.lists.getByTitle('UserDienstorte');
    const items = await list.items
      .filter(`AuthorId eq ${this.currentUser.Id}`)
      .select('Origin/Id', 'Destination/Id')
      .expand('Origin', 'Destination')
      .get();
    if (items.length == 0) {
      return new UserDienstorte(undefined, undefined);
    }
    if (items.length > 1) {
      console.error('found more than one item for UserDienstorte', items);
    }
    const posts = UserDienstorte.deserialize(items[0]);
    // workaround for fetching a Dienstposten's tags
    // since odata queries cannot expand values nested deeper than one level
    if (posts.origin) {
      posts.origin = await this.fetchSinglePost(posts.origin.id);
    }
    if (posts.destination) {
      posts.destination = await this.fetchSinglePost(posts.destination.id);
    }

    return posts;
  }

  public static async postUserPosts(posts: UserDienstorte): Promise<void> {
    if (this.isDev) {
      return;
    }
    const list = sp.web.lists.getByTitle('UserDienstorte');
    await Utilities.upsert(
      posts.serialize(),
      list,
      `AuthorId eq ${this.currentUser.Id}`
    );
  }


  /***************** Private Methods ***************/

  private static extractCategories(tasks: Task[]): Category[] {
    // group tasks by category name
    const categoryMap = {};

    tasks.forEach(t => {
      const categoryName = t.category.name;
      if(!categoryMap[categoryName]) {
        categoryMap[categoryName] = [];
      }
      categoryMap[categoryName].push(t);
    });

    // build Category for each named group
    const categories: Category[] = [];
    for (const key in categoryMap) {
      if (categoryMap.hasOwnProperty(key)) {
        const categoryTasks: Task[] = categoryMap[key];
        if (categoryTasks.length > 0) {
          const sortingKey = categoryTasks[0].category.sortingKey;
          categories.push(new Category(key, sortingKey, categoryTasks));
        }
      }
    }
    return categories;
  }
}
