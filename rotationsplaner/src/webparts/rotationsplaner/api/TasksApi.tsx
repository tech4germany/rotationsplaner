import {ItemAddResult, ItemUpdateResult, List, sp} from '@pnp/sp';
import {Category, CustomTask, Task} from "../classes/Checklist";

export default class TasksApi {

  public static async fetchTasks(userId: string) {
    const tasksData = await sp.web.lists.getByTitle('Tasks').items
      .select('Title', 'Kategorie', 'Id', 'Beschreibung', 'Gesetz', 'Formular',
        'Tags/Title', 'Kontakt/AnzeigeText', 'Kontakt/Link', 'Kontakt/Link')
      .expand('Tags', 'Kontakt')
      .get();

    const tasks: Task[] = tasksData.map(Task.deserializeTask);
    return this.fetchAndAddProgress(tasks, userId);
  }

  public static async fetchCustomTasks(currentUserId: string) : Promise<CustomTask[]> {
    const tasksData = await sp.web.lists.getByTitle('CustomTasks').items
      .filter(`AuthorId eq ${currentUserId}`)
      .select('ID', 'Title', 'Beschreibung', 'Category', 'AuthorId', 'Checked')
      .get();

    return tasksData.map(d => CustomTask.fromDatabase(d));
  }

  public static async saveTaskProgress(task: Task) {
    const list = sp.web.lists.getByTitle('TaskProgress');
    const payload = {TaskId: task.id, Checked: task.checked, Archived: task.isArchived};
    await this.upsert(payload, list, `Task eq ${task.id}`);
  }

  public static async saveCustomTask(task: CustomTask): Promise<CustomTask> {
    const list = sp.web.lists.getByTitle('CustomTasks');
    if (task.id !== undefined) {
      const result = await this.update(task.id, task.serialize(), list);
      return CustomTask.fromDatabase(result.data);
    }
    const payload = task.serialize();
    const result = await this.add(payload, list);
    console.info('saveCustomTask', result);
    return CustomTask.fromDatabase(result.data);
  }

  public static async deleteCustomTask(task: CustomTask) : Promise<void> {
    return sp.web.lists.getByTitle('CustomTasks').items.getById(task.id).delete();
  }




  /***************** Private Methods ***************/


  private static async fetchAndAddProgress(tasks: Task[], userId: string) {
    const list = sp.web.lists.getByTitle('TaskProgress');
    const progressData = await list.items
      .select('TaskId', 'Checked', 'Archived')
      .filter(`AuthorId eq ${userId}`)
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
}
