import {Task} from '../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from './Rotationsplaner.module.scss';

import ExpansionButton from './collapse/ExpansionButton';

export interface ArchivedChecklistItemState {
  checked: boolean;
}

export interface IArchivedChecklistItemProps {
  task: Task;
  onChange: (checked: boolean) => void; // TODO remove or combine with onAddItem
  onAddItem?: (task: Task) => void;
}

export default class ArchivedChecklistItem extends React.Component <IArchivedChecklistItemProps, ArchivedChecklistItemState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      checked: this.props.task.checked || false,
    };
  }

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.container}>
        {this._renderCheckbox()}
      </div>
    );
  }

  private _renderCheckbox() {
    return (
      <div className={`${styles.row} ${styles.checklistItemWrapper} ${styles.addableItem}`}>
        <Checkbox
          className={styles.checklistItem}
          label={this.props.task.name}
          disabled={true}
          checked={this.props.task.checked}
        />
        <ExpansionButton className={styles.archiveButton}
                         expanded={false}
                         onClick={() => this.onAddTask()}
                         icon='Add'/>
      </div>
    );
  }

  private onAddTask() {
    this.props.onAddItem(this.props.task);
  }
}
