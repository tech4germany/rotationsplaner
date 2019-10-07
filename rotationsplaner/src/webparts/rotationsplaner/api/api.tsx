import {Category, CustomTask, Post, Preference, Task, UserPost} from '../classes/Checklist';
import {sp} from '@pnp/sp';
import IWebPartContext from '@microsoft/sp-webpart-base/lib/core/IWebPartContext';
import MockData from './MockData';
import TasksApi from './TasksApi';
import PreferenceApi from './PreferenceApi';
import Utilities from "./Utilities";


function delay<T>(millis: number, value?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), millis));
}

export default class Api {
  private static isDev: boolean = false;
  private static currentUser: any;

  public static async init(context: IWebPartContext): Promise<void> {
    if (context.pageContext.web.title === 'Local Workbench')
      this.isDev = true;
    sp.setup({
      spfxContext: context
    });
    if (!this.isDev) {
      this.currentUser = await sp.web.currentUser.get();
    }
  }


  /*
  *
  * **************** Tasks ******************
  *
  * */

  public static async fetchCategories(): Promise<Category[]> {
    if (this.isDev) {
      return Promise.resolve(MockData.categories);
    }

    const tasks: Task[] = await TasksApi.fetchTasks(this.currentUser.Id);
    const customTasks: CustomTask[] = await TasksApi.fetchCustomTasks(this.currentUser.Id);
    const categories: Category[] = this.extractCategories(tasks);
    return this.mergeTasks(customTasks, categories);
  }

  private static mergeTasks(customTasks: CustomTask[], categories: Category[]): Category[] {
    customTasks.forEach(t => {
      const index = categories.map(c => c.name).indexOf(t.category);
      if (index !== -1) {
        categories[index].tasks.push(t);
      } else {
        categories.push(new Category(t.category, [t]));
      }
    });

    return categories;
  }

  public static async saveProgress(task: Task | CustomTask): Promise<void> {
    if (task instanceof Task) {
      await TasksApi.saveTaskProgress(task);
    } else {
      await TasksApi.saveCustomTask(task);
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

  public static postPreferences(preferences: Preference[]): Promise<void> {
    console.error('posting of preferences is not implemented');
    return Promise.resolve();
  }

  public static postCategory(category: Category): Promise<void> {
    console.log('adding a new category');
    return Promise.resolve();
  }

  public static fetchInfoData(): Promise<any> {
    return Promise.resolve(MockData.infoData);
  }

  public static async deleteAllUserData(): Promise<void> {
    const listNames = ['CustomTasks', 'UserPreferences', 'TaskProgress'];
    const lists = listNames.map(t => sp.web.lists.getByTitle(t));
    const promises = lists.map(l => Utilities.deleteAllCreatedByUser(this.currentUser.Id, l));
    await Promise.all(promises);
  }





  /*
   *
   *  **************** Post ******************
   *
   */

  public static async fetchPosts(): Promise<Post[]> {
    const list = sp.web.lists.getByTitle('Vertretung_temp');
    const items = await list.items
      .select('Tags/Title', 'Title', 'Id')
      .expand('Tags')
      .get();
    return items.map(Post.deserialize);
  }

  public static async fetchSinglePost(id: number): Promise<Post> {
    const list = sp.web.lists.getByTitle('Vertretung_temp');
    const data = await list.items.getById(id).get();
    return Post.deserialize(data);
  }

  public static async fetchUserPosts(): Promise<Array<UserPost | undefined>> {
    const list = sp.web.lists.getByTitle('UserPosts');
    const items = await list.items
      .filter(`AuthorId eq ${this.currentUser.Id}`)
      .select('Post/Id', 'Post/Title', 'IsDestination')
      .expand('Post')
      .get();
    const userPosts = items.map(UserPost.deserialize);
    userPosts.forEach(async up => {
      // workaround for fetching a Post's tags
      // since odata queries cannot expand values nested deeper than one level
      if (up.post)
        up.post = await this.fetchSinglePost(up.post.id);
    });
    if(userPosts.length > 2) {
      console.error('more than two UserPosts saved for user', userPosts);
    }

    const selectedPosts: Array<(UserPost | undefined)> = [undefined, undefined];

    const originPosts = userPosts.filter(p => p.isOrigin);
    const originPost = (originPosts.length > 0) ? originPosts[0] : undefined;

    const destinationPosts = userPosts.filter(p => p.isDestination);
    const destinationPost = (destinationPosts.length > 0) ? destinationPosts[0] : undefined;

    return [originPost, destinationPost];
  }

  public static async postUserPosts(posts: Array<UserPost | undefined>): Promise<void> {
    const list = sp.web.lists.getByTitle('UserPosts');
    const origin = posts[0] || new UserPost(false, undefined);
    const destination = posts[1] || new UserPost(true, undefined);
    console.log(origin, destination);
    await Utilities.upsert(
      origin.serialize(),
      list,
      `AuthorId eq ${this.currentUser.Id} and IsDestination eq ${origin.isDestination ? 1 : 0}`
    );
    await Utilities.upsert(
      destination.serialize(),
      list,
      `AuthorId eq ${this.currentUser.Id} and IsDestination eq ${destination.isDestination  ? 1 : 0}`
    );
  }


  /***************** Private Methods ***************/

  private static extractCategories(tasks: Task[]): Category[] {

    const categories: string[] = tasks
      .map((t) => t.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    const categoryMap = {};

    tasks.forEach(t => {
      if(!categoryMap[t.category]) {
        categoryMap[t.category] = [];
      }

      categoryMap[t.category].push(t);
    });

    return categories.map(k => new Category(k, categoryMap[k]));
  }
}
