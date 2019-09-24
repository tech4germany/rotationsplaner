import * as React from 'react';
import styles from './Rotationsplaner.module.scss';

import ExpansionButton from './ExpansionButton';
import AdvancedChecklistItem from './AdvancedChecklistItem';
import {Task} from "../classes/Checklist";

export interface IChecklistSectionProps {
  tasks: Task[];
  title: string;
  isAddable?: boolean;
  onTasksChange: (tasks: Task[]) => void;
  onAddSection?: () => void;
}

export interface ChecklistSectionState {
  expanded: boolean;
  tasks: Task[];
  isAddable: boolean;
}

const defaultTask = new Task({name: 'Eine Aufgabe hinzufügen', isCustom: false}, false, null);

export default class ChecklistSection extends React.Component < IChecklistSectionProps, ChecklistSectionState > {
  public state: ChecklistSectionState = {tasks: [], expanded: false, isAddable: false};

  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks,
      expanded: false,
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
      <section className={`${styles.checklistSection} ${this.state.isAddable ? styles.addableItem : ''}`}>
        <div className={styles.header} onClick={e => this.toggleExpanded()}>
          <ExpansionButton
            expanded={this.state.expanded}
            icon={this.state.isAddable ? 'Add' : null}
          />
          <span className={styles.title}>{this.props.title}</span>
          {this.renderCompletedCount}
        </div>
        {this.state.isAddable ? '' : this.renderSectionContent()}
      </section>
    );
  }

  private toggleExpanded() {
    if(this.state.isAddable) {
      this.props.onAddSection()
    } else {
      this.setState((current) => ({...current, expanded: !current.expanded}));
    }
  }

  private renderCompletedCount() {
    return (
      <span className={styles.progress}>
        {this.state.isAddable ? '' : `${this.completedItemCount()} von ${this.props.tasks.length} erledigt` }
      </span>
    )
  }

  private renderSectionContent() {
    return <div className={`${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
      <div className={styles.row}>
        <div className={''}>
          {this._generateCheckListItems(this.state.tasks)}
          <AdvancedChecklistItem task={defaultTask}
                                 onChange={()=> {}}
                                 isAddable={true}
                                 onAddItem={this.onAddTask.bind(this)}/>
        </div>
      </div>
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

  private onAddTask() {
    console.log("adding Task for category " + this.props.title)
  }
}
