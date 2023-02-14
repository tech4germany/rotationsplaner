import {CustomTask, Task} from '../../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from '../collapse/ExpansionButton';
import {IconButton} from 'office-ui-fabric-react/lib/Button';

export interface ArchivedChecklistItemState {
}

export interface IArchivedChecklistItemProps {
  task: (Task | CustomTask);
  onAddItem?: (task: (Task | CustomTask)) => void;
}

export default class ArchivedChecklistItem extends React.Component <IArchivedChecklistItemProps, ArchivedChecklistItemState> {

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.checklistItem}>
        <div className={`${styles.checklistItemWrapper} ${styles.transparentItem}`}>
          <div className={styles.checklistItemPrimary}>
            <Checkbox
              className={styles.checklistCheckbox}
              label={this.props.task.title}
              disabled={true}
              checked={this.props.task.checked}
            />
          </div>
          <IconButton
            className={styles.archiveButton}
            onClick={() => this.onUnarchiveTask()}
            icon='Add'
            title='Wiederherstellen'
          />
        </div>
      </div>
    );
  }

  private onUnarchiveTask() {
    this.props.onAddItem(this.props.task);
  }
}
