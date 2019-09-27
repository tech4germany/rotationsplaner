import {CustomTask, Task} from '../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from './Rotationsplaner.module.scss';

import ExpansionButton from './collapse/ExpansionButton';
import ChecklistItemDetails from "./ChecklistItemDetails";

export interface AdvancedChecklistItemState {
  checked: boolean;
  expanded: boolean;
  isAddable: boolean;
}

export interface IAdvancedChecklistItemProps {
  checked?: boolean;
  isAddable?: boolean;
  task: Task | CustomTask;
  onChange: (checked: boolean) => void;
  onAddItem?: () => void;
  onArchiveItem?: (task: Task) => void;
}

export default class ChecklistItem extends React.Component <IAdvancedChecklistItemProps, AdvancedChecklistItemState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      checked: this.props.checked || false,
      expanded: false,
      isAddable: this.props.isAddable || false,
    };
  }

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.container}>
        {this._renderHeader()}
        {this._renderContent()}
      </div>
    );
  }

  private _renderHeader() {
    return (
      <div className={`${styles.row} ${styles.checklistItemWrapper} ${this.state.isAddable ? styles.addableItem : ''}`}
           onClick={this.toggleExpanded.bind(this)}>
        <Checkbox
          className={styles.checklistItem}
          label={this.props.task.name}
          key={this.props.task.id}
          disabled={this.props.isAddable}
          onChange={(ev, checked) => this.props.onChange(checked)}
          checked={this.props.task.checked}
        />
        <ExpansionButton expanded={this.state.expanded}
                         icon={this.state.isAddable ? 'Add' : 'Info'}/>
        {this.state.isAddable ? '' : (<ExpansionButton className={styles.archiveButton}
                                                       expanded={false}
                                                       onClick={e => this.onArchiveTask(e)}
                                                       icon='Cancel'/>)}
      </div>
    );
  }

  private _renderContent() {
    return (
      <div className={`${styles.checklistItemContent} ${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
        <ChecklistItemDetails task={this.props.task} />
      </div>
    );
  }

  private onArchiveTask(event: any) {
    console.log('onArchiveTask');
    // avoid propagation of click event to expand
    event.stopPropagation();
    if(this.props.task instanceof Task) {
      this.props.onArchiveItem(this.props.task);
    } else {
      console.error('onArchiveItem called on non-Task');
    }
  }

  private toggleExpanded() {
    if(this.state.isAddable) {
      this.props.onAddItem();
    } else {
      this.setState((current) => ({...current, expanded: !current.expanded}));
    }
  }
}
