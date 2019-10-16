import {ItemAddResult, sp} from '@pnp/sp';
import {Category, Contact, CustomTask, Task} from '../classes/Checklist';
import Utilities from './Utilities';

export default class TasksApi {

  public static async fetchTasks(userId: string): Promise<Task[]> {
    const tasksData = await sp.web.lists.getByTitle('Tasks').items
      .select('Title',
        'Kategorie1/Title', 'Kategorie1/Reihenfolge',
        'Id', 'Beschreibung', 'Gesetz', 'Formular',
        'Bedingung/Title', 'Dienstort/Title', ...Contact.queryFields)
      .expand('Bedingung', 'Ansprechpartner', 'Dienstort', 'Kategorie1')
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
}
