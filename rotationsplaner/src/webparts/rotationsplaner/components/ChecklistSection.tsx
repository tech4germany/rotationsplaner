import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import ExpansionButton from './ExpansionButton';
import AdvancedChecklistItem from './AdvancedChecklistItem';
import { Task } from "../classes/Checklist";

export interface IChecklistSectionProps {
  tasks: Task[];
  title: string;
  onTasksChange: (tasks: Task[]) => void;
}

export interface ChecklistSectionState {
  expanded: boolean;
  tasks: Task[];
}


export default class ChecklistSection extends React.Component < IChecklistSectionProps, ChecklistSectionState > {
  public state: ChecklistSectionState = {tasks: [], expanded: false};

  constructor(props) {
    super(props);
    this.state = {tasks: props.tasks, expanded: false};
  }


  private completedItemCount(): number {
    return this.props.tasks.filter(t => t.checked).length;
  }

  public render(): React.ReactElement<IChecklistSectionProps> {
    return(
      <section className={styles.checklistSection}>
        <div className={styles.header} onClick={e => this.toggleExpanded()}>
          <ExpansionButton expanded={this.state.expanded}/>
          <span className={styles.title}>{this.props.title}</span>
          <span className={styles.progress}>{this.completedItemCount()} von {this.props.tasks.length} erledigt</span>
        </div>
        {this.renderSectionContent()}
      </section>
    );
  }

  private toggleExpanded() {
    this.setState((current) => ({...current, expanded: !current.expanded}));
  }

  private renderSectionContent() {
    return <div className={`${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
      <div className={styles.row}>
        <div className={''}>
          {this._generateCheckListItems(this.state.tasks)}
        </div>
      </div>
    </div>;
  }

  private _generateCheckListItems(tasks: Task[]) {
    return tasks.map(
      (task, index) => <AdvancedChecklistItem task={task} onChange={this.onChangeChecked.bind(this, index)}/>
      );
  }

  private onChangeChecked(index: number, checked: boolean) {
    const tasks = this.state.tasks;
    tasks[index].checked = checked;
    this.props.onTasksChange(tasks);
    this.setState(previous => ({...previous, tasks: tasks}));
  }
}

interface ChecklistItemProps {
  task: Task;
  onChange: (checked: boolean) => void;
  key: string;
}
