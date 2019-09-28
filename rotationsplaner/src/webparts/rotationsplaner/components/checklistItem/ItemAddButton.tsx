import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from '../Rotationsplaner.module.scss';
import {IconButton} from 'office-ui-fabric-react/lib/Button';


export interface IAdvancedChecklistItemProps {
  onAddItem: () => void;
}

export default class ChecklistItemAddButton extends React.Component <IAdvancedChecklistItemProps, {}> {

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.container}>
        {this._renderHeader()}
      </div>
    );
  }

  private _renderHeader() {
    return (
      <div className={`${styles.row} ${styles.checklistItemWrapper} ${styles.addableItem}`}
           onClick={this.props.onAddItem}>
        <Checkbox
          className={`${styles.checklistCheckbox} ${styles.checklistItemPrimary}`}
          label='Eine Aufgabe hinzufügen'
          disabled={true}
          checked={false}
        />
        <IconButton iconProps={{iconName: 'Add'}}
                    ariaLabel={'Eine Aufgabe hinzufügen'}
                    className={styles.headerButton} />
      </div>
    );
  }

}
