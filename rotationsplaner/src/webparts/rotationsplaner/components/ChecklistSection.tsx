import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import ChecklistItem from './checklistItem/Item';
import {CustomTask, Task} from '../classes/Checklist';
import api from '../api/api';
import Collapse from './collapse/Collapse';
import ArchivedChecklistItem from './checklistItem/ArchivedItem';
import ChecklistItemAddButton from './checklistItem/ItemAddButton';

export interface IChecklistSectionProps {
  tasks: (Task | CustomTask)[];
  title: string;
  onTasksChange: (tasks: (Task | CustomTask)[]) => void;
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
      tasks: props.tasks.filter(t => ! t.isArchived),
      archivedTasks: props.tasks.filter(t => t.isArchived),
      isAddable: props.isAddable || false,
      isEditing: false,
      collapseArchivedTasks: true
    };
  }

  public componentWillReceiveProps(props) {
    this.setState(prevState => ({
      ...prevState,
      tasks: props.tasks.filter(t => ! t.isArchived),
      archivedTasks: props.tasks.filter(t => t.isArchived)
    }));
  }

  private completedItemCount(): number {
    return this.state.tasks.filter(t => t.checked).length;
  }

  public render(): React.ReactElement<IChecklistSectionProps> {
    return(
      <Collapse
        title={this.props.title}
        headerSecondary={this.renderCompletedCount()}
      >
        {this.renderSectionContent()}
      </Collapse>
    );
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
      return <ChecklistItem
        task={CustomTask.emptyTask(this.props.title)}
        editing={true}
        onChange={task => this.onAddTask(task as CustomTask)}
      />;
    }
  }

  private _generateCheckListItems(tasks: (Task | CustomTask)[]) {
    return tasks.map((task, index) =>
        <ChecklistItem
          task={task}
          onChange={this.onChangeTask.bind(this, index)}
          onArchiveItem={this.onArchiveTask.bind(this)}
          key={task.id}
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
    await api.saveProgress(newTask); // TODO catch errors
  }

  private async onAddArchivedTask(task: Task): Promise<void> {
    task.isArchived = false;
    this.props.onTasksChange([...this.state.tasks, ...this.state.archivedTasks]);
    await api.saveProgress(task);
  }

  private async onArchiveTask(task: Task | CustomTask): Promise<void> {
    if(task instanceof Task) {
      task.isArchived = true;
      // call parent update method
      this.props.onTasksChange([...this.state.tasks, ...this.state.archivedTasks]);
      await api.saveProgress(task);
    } else { // Delete custom Task instead of archiving
      // call parent update method
      const filteredTasks = this.state.tasks.filter(t => t.id !== task.id);
      this.props.onTasksChange([...filteredTasks, ...this.state.archivedTasks]);
      await api.deleteCustomTask(task);
    }
  }

  private async onAddTask(task: CustomTask): Promise<void> {
    const newTask: Task | CustomTask = await api.saveProgress(task);
    // use new Tasks returned from API to set ID
    const tasks = this.state.tasks;
    if(!task.isEmpty) {
      tasks.push(newTask);
    }
    this.setState(prevState => {
      return {...prevState, tasks: tasks, isEditing: false};
    });
    this.props.onTasksChange(tasks);
  }

  private onShowMoreTasks(): void {
    this.setState(prevState => ({...prevState, collapseArchivedTasks: !this.state.collapseArchivedTasks}));
  }
}
