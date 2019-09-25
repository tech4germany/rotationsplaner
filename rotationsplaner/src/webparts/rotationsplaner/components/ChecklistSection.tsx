import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import AdvancedChecklistItem from './AdvancedChecklistItem';
import {Task} from "../classes/Checklist";
import api from "../api/api";
import Collapse from "./collapse/Collapse";

export interface IChecklistSectionProps {
  tasks: Task[];
  title: string;
  onTasksChange: (tasks: Task[]) => void;
}

export interface ChecklistSectionState {
  tasks: Task[];
  isAddable: boolean;
}

const defaultTask = new Task({name: 'Eine Aufgabe hinzufügen', isCustom: false}, false, null);

export default class ChecklistSection extends React.Component < IChecklistSectionProps, ChecklistSectionState > {
  public state: ChecklistSectionState = {tasks: [], isAddable: false};

  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks,
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
          key={task.key}
        />
      );
  }

  private onChangeChecked(index: number, checked: boolean) {
    const tasks = this.state.tasks;
    tasks[index].checked = checked;
    this.props.onTasksChange(tasks);
    this.setState(previous => ({...previous, tasks: tasks}));
  }

  private async onAddTask(task: Task) {
    await api.postTask(task, this.props.title);
  }
}
