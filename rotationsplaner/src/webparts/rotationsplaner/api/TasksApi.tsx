import {ItemAddResult, sp} from '@pnp/sp';
import {AnyTask, Category, Contact, CustomTask, Dienstposten, Task, UserDienstorte} from '../classes/Checklist';
import Utilities from './Utilities';
import MockData from "./MockData";
import Api from "./api";

export default class TasksApi {

  public static async fetchCategories(posts?: UserDienstorte): Promise<Category[]> {
    if (Api.isDev) {
      return Promise.resolve(MockData.categories);
    }

    const tasks: Task[] = await TasksApi.fetchTasks(Api.currentUser.Id, posts);
    const customTasks: CustomTask[] = await TasksApi.fetchCustomTasks(Api.currentUser.Id);
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
    const filter = `DienstortId eq ${posts.destination.id}`;
    const tasks = await this.fetchTasksWithFilter(Api.currentUser.Id, filter);
    existing.forEach(category => this.removeLocationSpecificTasks(category));
    tasks.forEach(t => this.insertTaskIntoCategories(t, existing));
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

  public static async fetchTasks(userId: string, posts?: UserDienstorte): Promise<Task[]> {
    const filter = posts && posts.destination
      ? `(DienstortId eq null) or (DienstortId eq ${posts.destination.id})`
      : 'DienstortId eq null';

    return this.fetchTasksWithFilter(userId, filter);
  }

  private static async fetchTasksWithFilter(userId: string, filter: string): Promise<Task[]> {
    const tasksData = await sp.web.lists.getByTitle('Tasks').items
      .select('Title',
        'Kategorie1/Title', 'Kategorie1/Reihenfolge',
        'Id', 'Beschreibung', 'Gesetz', 'Formular',
        'Bedingungen/Title', 'Dienstort/Title', ...Contact.queryFields)
      .filter(filter)
      .expand('Bedingungen', 'Ansprechpartner', 'Dienstort', 'Kategorie1')
      .getAll();

    const tasks: Task[] = tasksData.map(Task.deserializeTask);
    return this.fetchAndAddProgress(tasks, userId);
  }

  public static async fetchCustomTasks(currentUserId: string): Promise<CustomTask[]> {
    const tasksData = await sp.web.lists.getByTitle('UserCustomTasks').items
      .filter(`AuthorId eq ${currentUserId}`)
      .select('ID', 'Title', 'Beschreibung', 'Category', 'AuthorId', 'Checked')
      .getAll();

    return tasksData.map(d => CustomTask.fromDatabase(d));
  }

  public static async saveTaskProgress(task: Task): Promise<Task> {
    const list = sp.web.lists.getByTitle('UserTaskProgress');
    const payload = {TaskId: task.id, Checked: task.checked, Archived: task.isArchived};
    await Utilities.upsert(payload, list, `Task eq ${task.id}`);
    return task;
  }

  public static async saveCustomTask(task: CustomTask): Promise<CustomTask> {
    const list = sp.web.lists.getByTitle('UserCustomTasks');
    if (task.id !== undefined) {
      const result = await Utilities.update(task.id, task.serialize(), list);
      return CustomTask.fromDatabase(result.data);
    }
    const payload = task.serialize();
    const result: ItemAddResult = await Utilities.add(payload, list);
    console.info('saveCustomTask', result);
    return CustomTask.fromDatabase(result.data);
  }

  public static async deleteCustomTask(task: CustomTask): Promise<void> {
    return sp.web.lists.getByTitle('UserCustomTasks').items.getById(task.id).delete();
  }

  /***************** Private Methods ***************/

  private static async fetchAndAddProgress(tasks: Task[], userId: string): Promise<Task[]> {
    const list = sp.web.lists.getByTitle('UserTaskProgress');
    const progressData = await list.items
      .select('TaskId', 'Checked', 'Archived')
      .filter(`AuthorId eq ${userId}`)
      .get();
    const taskMapById = new Map<number, Task>(
      tasks.map(t => [t.id, t] as [number, Task])
    );
    progressData.forEach(p => {
      const task = taskMapById.get(p.TaskId);
      if (!task) {
        console.warn('no task for progress', p);
      } else {
        task.checked = p.Checked;
        task.isArchived = p.Archived;
      }
    });
    return tasks;
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
