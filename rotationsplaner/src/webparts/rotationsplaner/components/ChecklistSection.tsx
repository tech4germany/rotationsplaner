import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { Task } from "../classes/Checklist";

export interface IChecklistSectionProps {
  tasks: Task[];
  title: string;
}

export interface ChecklistState {
  expanded: boolean;
}

class ExpansionButton extends React.Component<{ expanded: boolean, onClick: (event) => void }, {}> {
  public render() {
    return <IconButton iconProps={{iconName: this.props.expanded ? "ChevronDown" : "ChevronRight"}}
                       title={"Abschnitt ein/ausklappen"}
                       ariaLabel={this.props.expanded ? "einklappen" : "ausklappen"}
                       onClick={this.props.onClick} />;
  }
}

export default class ChecklistSection extends React.Component < IChecklistSectionProps, ChecklistState > {
  public state: ChecklistState = {expanded: false};

  private completedItemCount(): number {
    return this.props.tasks.filter(t => t.checked).length;
  }

  public render(): React.ReactElement<IChecklistSectionProps> {
    return(
      <section className={styles.checklistSection}>
        <ExpansionButton expanded={this.state.expanded}
                         onClick={e => this.toggleExpanded()}/>
        <span className={styles.title}>{this.props.title}</span>
        <span className={styles.progress}>{this.completedItemCount()} von {this.props.tasks.length} erledigt</span>
        {this.state.expanded ? this._generateCheckListItems() : undefined}
      </section>
    );
  }

  private toggleExpanded() {
    this.setState({expanded: !this.state.expanded});
  }

  private sectionContent() {
    return <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.sectionTask}>
          {this._generateCheckListItems()}
        </div>
        <div className={styles.sectionInfo}>Lorem Ipsum Dolor sit amet</div>
      </div>
    </div>
  }
  private _generateCheckListItems() {
    return this.props.tasks.map(this.buildTask);
  }

  private buildTask(task: Task) {
    return <Checkbox className={styles.checklistItem} label={task.description.name} checked={task.checked}/>;
  }

  private _onCheckboxChange = (index: number, ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
    console.log(`The option ${index} has been changed to ${isChecked}.`);
  }
}
