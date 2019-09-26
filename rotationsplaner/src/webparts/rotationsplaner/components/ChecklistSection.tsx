import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import AdvancedChecklistItem from './AdvancedChecklistItem';
import {Task} from '../classes/Checklist';
import api from '../api/api';
import Collapse from './collapse/Collapse';
import ArchivedChecklistItem from "./ArchivedChecklistItem";

export interface IChecklistSectionProps {
  tasks: Task[];
  title: string;
  onTasksChange: (tasks: Task[]) => void;
}

export interface ChecklistSectionState {
  tasks: Task[];
  archivedTasks: Task[];
  isAddable: boolean;
}

const defaultTask = new Task({name: 'Eine Aufgabe hinzufügen', isCustom: false}, false, false,null);

export default class ChecklistSection extends React.Component < IChecklistSectionProps, ChecklistSectionState > {
  public state: ChecklistSectionState = {tasks: [], archivedTasks: [], isAddable: false};

  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks.filter(t => ! t.isArchived),
      archivedTasks: props.tasks.filter(t => t.isArchived),
      isAddable: props.isAddable || false
    };
  }

  public componentWillReceiveProps(props) {
    this.setState(prevState => ({
      ...prevState,
      tasks: props.tasks
    }));
  }

  private completedItemCount(): number {
    return this.props.tasks.filter(t => t.checked).length;
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


  private renderCompletedCount() {
    return (
      <span className={styles.progress}>
        {this.state.isAddable ? '' : `${this.completedItemCount()} von ${this.props.tasks.length} erledigt` }
      </span>
    )
  }

  private renderSectionContent() {
    return <div className={styles.row}>
      {this._generateCheckListItems(this.state.tasks)}
      {this._generateArchivedCheckListItems(this.state.archivedTasks)}
      <AdvancedChecklistItem
        task={defaultTask}
        onChange={()=> {}}
        isAddable={true}
        onAddItem={this.onAddTask.bind(this)}
      />
    </div>;
  }

  private _generateCheckListItems(tasks: Task[]) {
    return tasks.map((task, index) =>
        <AdvancedChecklistItem
          task={task}
          onChange={this.onChangeChecked.bind(this, index)}
          onArchiveItem={this.onArchiveTask.bind(this)}
          key={task.key}
        />
      );
  }

  private _generateArchivedCheckListItems(tasks: Task[]) {
    return tasks.map((task, index) =>
        <ArchivedChecklistItem
          task={task}
          onChange={this.onChangeChecked.bind(this, index)}
          key={task.key}
          onAddItem={this.onAddArchivedTask.bind(this)}
        />
      );
  }


  private async onChangeChecked(index: number, checked: boolean): Promise<void> {
    const tasks = this.state.tasks;
    const task = tasks[index];
    task.checked = checked;
    this.props.onTasksChange(tasks);
    await api.saveTaskProgress(task);
    this.setState(previous => ({...previous, tasks: tasks}));
  }

  private async onAddArchivedTask(task: Task) {
    this.state.tasks.push(task);
    this.state.archivedTasks = this.state.archivedTasks.filter(t => t != task);

    this.setState(prev => ({
      ...prev,
      archivedTasks: this.state.archivedTasks.filter(t => t != task),
      tasks: this.state.tasks.concat(task)
    }));
  }

  private async onArchiveTask(task: Task) {
    this.setState(prev => ({
      ...prev,
      archivedTasks: this.state.archivedTasks.concat(task),
      tasks: this.state.tasks.filter(t => t != task)
    }));
  }

  private async onAddTask() {
    // get Task title & Description

    await api.createTask('Custom Task', this.props.title);
  }
}
