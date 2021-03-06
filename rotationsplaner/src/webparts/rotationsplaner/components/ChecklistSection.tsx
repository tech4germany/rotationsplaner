import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import ChecklistItem from './checklistItem/Item';
import {CustomTask, Task} from '../classes/Checklist';
import Collapse from './collapse/Collapse';
import ArchivedChecklistItem from './checklistItem/ArchivedItem';
import ChecklistItemAddButton from './checklistItem/ItemAddButton';
import TasksApi from "../api/TasksApi";

export interface IChecklistSectionProps {
  tasks: (Task | CustomTask)[];
  title: string;
  onTasksChange: (tasks: (Task | CustomTask)[]) => void;
  defaultExpanded?: boolean;
}

export interface ChecklistSectionState {
  tasks: (Task | CustomTask)[];
  archivedTasks: (Task | CustomTask)[];
  collapseArchivedTasks: boolean;
  isAddable: boolean;
  isEditing: boolean;
}

export default class ChecklistSection extends React.Component < IChecklistSectionProps, ChecklistSectionState > {
  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks.filter(t => !t.isArchived),
      archivedTasks: props.tasks.filter(t => t.isArchived),
      isAddable: props.isAddable || false,
      isEditing: false,
      collapseArchivedTasks: true
    };
  }

  public componentWillReceiveProps(props) {
    this.setState(prevState => ({
      ...prevState,
      tasks: props.tasks.filter(t => !t.isArchived),
      archivedTasks: props.tasks.filter(t => t.isArchived)
    }));
  }

  private completedItemCount(): number {
    return this.state.tasks.filter(t => t.checked).length;
  }

  public render(): React.ReactElement<IChecklistSectionProps> {
    return(
      <Collapse
        defaultExpanded={this.props.defaultExpanded || false}
        title={this.props.title}
        headerSecondary={this.renderCompletedCount()}
        onCollapse={() => this.onCollapse()}
        className={this.areAllTasksCompleted() ? styles.completed : ''}
      >
        {this.renderSectionContent()}
      </Collapse>
    );
  }

  public areAllTasksCompleted(): boolean {
    const tasks = this.state.tasks;
    if (tasks.length == 0) return false;
    return tasks.every(task => task.checked);
  }

  private renderCompletedCount(): React.ReactElement<IChecklistSectionProps> {
    return (
      <span className={styles.progress}>
        {this.state.isAddable ? '' : `${this.completedItemCount()} von ${this.state.tasks.length} erledigt` }
      </span>
    );
  }

  private renderSectionContent(): React.ReactElement<IChecklistSectionProps> {
    return <div className={styles.row}>
      {this._generateCheckListItems(this.state.tasks)}
      {this._renderAddItemSection()}
      {this.state.archivedTasks && this.state.archivedTasks.length > 0 && this.state.collapseArchivedTasks === false
        ? this._renderCollapsedArchivedTasksButton('Archivierte Aufgaben ausblenden') : null}
      {this.state.archivedTasks && this.state.archivedTasks.length > 0 ?
        (this.state.collapseArchivedTasks
        ? this._renderCollapsedArchivedTasksButton('Archivierte Aufgaben anzeigen')
        : this._generateArchivedCheckListItems(this.state.archivedTasks))
      : null}
    </div>;
  }

  private _renderAddItemSection(): React.ReactElement<IChecklistSectionProps> {
    if(!this.state.isEditing) {
      return <ChecklistItemAddButton
        onAddItem={() => this.setState(prevState => ({...prevState, isEditing: true}))}
      />;
    } else {
      // render input for new task
      return <ChecklistItem
        task={CustomTask.emptyTask(this.props.title)}
        editing={true}
        onChange={task => this.onCreateCustomTask(task as CustomTask)}
        onAbortTaskCreation={() => this.onAbortTaskCreation()}
      />;
    }
  }

  private _generateCheckListItems(tasks: (Task | CustomTask)[]) {
    return tasks.map((task, index) =>
        <ChecklistItem
          task={task}
          onChange={this.onChangeTask.bind(this, index)}
          onArchiveItem={this.onArchiveTask.bind(this)}
          key={task.key}
        />
      );
  }

  private _generateArchivedCheckListItems(tasks: (Task | CustomTask)[]): React.ReactElement<IChecklistSectionProps>[] {
    return tasks.map((task, index) =>
        <ArchivedChecklistItem
          task={task}
          // onChange={this.onChangeTask.bind(this, index)}
          key={task.id}
          onAddItem={this.onAddArchivedTask.bind(this)}
        />
      );
  }

  private _renderCollapsedArchivedTasksButton(text): React.ReactElement<IChecklistSectionProps> {
    return (<div onClick={this.onShowMoreTasks.bind(this)}>
      <span className={styles.showMoreTasks}>
        {text}
      </span>
    </div>);
  }

  private async onChangeTask(index: number, newTask: Task | CustomTask): Promise<void> {
    const tasks = this.state.tasks;
    tasks[index] = newTask;
    // TODO: optimize, not all the sections and tasks will need to be re-rendered
    // call parent update method
    this.props.onTasksChange([...this.state.tasks, ...this.state.archivedTasks]);
    this.setState(previous => ({...previous, tasks: tasks}));
    await TasksApi.saveProgress(newTask); // TODO catch errors
  }

  private async onAddArchivedTask(task: Task): Promise<void> {
    task.isArchived = false;
    this.props.onTasksChange([...this.state.tasks, ...this.state.archivedTasks]);
    await TasksApi.saveProgress(task);
  }

  private async onArchiveTask(task: Task | CustomTask): Promise<void> {
    if(task instanceof Task) {
      // ensure archived tasks are visible when a task is move to archived
      this.setState(prevState => ({...prevState, collapseArchivedTasks: false}));
      task.isArchived = true;
      // call parent update method
      this.props.onTasksChange([...this.state.tasks, ...this.state.archivedTasks]);
      await TasksApi.saveProgress(task);
    } else { // Delete custom Task instead of archiving
      // call parent update method
      const filteredTasks = this.state.tasks.filter(t => t.id !== task.id);
      this.props.onTasksChange([...filteredTasks, ...this.state.archivedTasks]);
      await TasksApi.deleteCustomTask(task);
    }
  }

  private async onCreateCustomTask(task: CustomTask): Promise<void> {
    const newTask: Task | CustomTask = await TasksApi.saveProgress(task);
    // use new Tasks returned from API to set ID
    const tasks = this.state.tasks;
    if(!task.isEmpty) {
      tasks.push(newTask);
    }
    this.setState(prevState => {
      return {...prevState, tasks: tasks, isEditing: false};
    });
    const allTasks = [...tasks, ...this.state.archivedTasks];
    console.log('allTasks', allTasks);
    this.props.onTasksChange(allTasks);
  }

  private onAbortTaskCreation(): void {
    // just go back to non-editing mode
    this.setState(prevState => {
      return {...prevState, isEditing: false};
    });
  }

  private onCollapse(): void {
    // hide archived tasks automatically on collapse
    if (!this.state.collapseArchivedTasks) {
      this.onShowMoreTasks();
    }
  }

  private onShowMoreTasks(): void {
    this.setState(prevState => ({...prevState, collapseArchivedTasks: !this.state.collapseArchivedTasks}));
  }
}
