import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
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

class ExpansionButton extends React.Component<{ expanded: boolean, onClick: (event) => void }, {}> {
  public render() {
    return <IconButton iconProps={{iconName: "ChevronRight"}}
                       title={"Abschnitt ein/ausklappen"}
                       ariaLabel={this.props.expanded ? "einklappen" : "ausklappen"}
                       onClick={this.props.onClick}
                       className={this.props.expanded ? styles.arrowDown : styles.arrowRight}/>;
  }
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
        <div className={styles.header}>
          <ExpansionButton expanded={this.state.expanded}
                           onClick={e => this.toggleExpanded()}/>
          <span className={styles.title}>{this.props.title}</span>
          <span className={styles.progress}>{this.completedItemCount()} von {this.props.tasks.length} erledigt</span>
        </div>
        {this.renderSectionContent()}
        {/*{this.state.expanded ? this.sectionContent() : undefined}*/}
      </section>
    );
  }

  private toggleExpanded() {
    this.setState((current) => ({...current, expanded: !current.expanded}));
  }

  private renderSectionContent() {
    return <div className={`${styles.container} ${this.state.expanded ? styles.sectionContentVisible : styles.sectionContentHidden}`}>
      <div className={styles.row}>
        <div className={styles.column}>
          Lorem Ipsum Dolor sit amet
        </div>
        <div className={styles.column}>
          {this._generateCheckListItems(this.state.tasks)}
        </div>
      </div>
    </div>;
  }

  private _generateCheckListItems(tasks: Task[]) {
    return tasks.map(
      (task, index) => <ChecklistItem task={task} key={task.key} onChange={this.onChangeChecked.bind(this, index)}/>
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

class ChecklistItem extends React.Component < ChecklistItemProps, {} > {
  public state = {};

  public render(): React.ReactElement<{}> {
    return <Checkbox
      className={styles.checklistItem}
      label={this.props.task.description.name}
      onChange={(ev, checked) => this.props.onChange(checked)}
    />;
  }


}
