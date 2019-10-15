import {CustomTask, Task} from '../../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from '../collapse/ExpansionButton';

export interface ArchivedChecklistItemState {
}

export interface IArchivedChecklistItemProps {
  task: (Task | CustomTask);
  // onChange: (task: Task) => void; // TODO remove or combine with onAddItem
  onAddItem?: (task: (Task | CustomTask)) => void;
}

export default class ArchivedChecklistItem extends React.Component <IArchivedChecklistItemProps, ArchivedChecklistItemState> {

  public render(): React.ReactElement<{}> {
    return (
      <div>
        {this._renderCheckbox()}
      </div>
    );
  }

  private _renderCheckbox() {
    return (
      <div className={`${styles.checklistItemWrapper} ${styles.transparentItem}`}>
        <Checkbox
          className={`${styles.checklistCheckbox} ${styles.checklistItemPrimary}`}
          label={this.props.task.title}
          disabled={true}
          checked={this.props.task.checked}
        />
        <ExpansionButton className={styles.archiveButton}
                         expanded={false}
                         onClick={() => this.onUnarchiveTask()}
                         icon='Add'/>
      </div>
    );
  }

  private onUnarchiveTask() {
    this.props.onAddItem(this.props.task);
  }
}
