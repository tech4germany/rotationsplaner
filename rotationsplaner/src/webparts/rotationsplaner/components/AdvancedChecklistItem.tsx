import {Task} from '../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from './Rotationsplaner.module.scss';

import ExpansionButton from './collapse/ExpansionButton';

export interface AdvancedChecklistItemState {
  checked: boolean;
  expanded: boolean;
  isAddable: boolean;
}

export interface IAdvancedChecklistItemProps {
  checked?: boolean;
  isAddable?: boolean;
  task: Task;
  onChange: (checked: boolean) => void;
  onAddItem?: () => void;
}

export default class Checklist extends React.Component <IAdvancedChecklistItemProps, AdvancedChecklistItemState> {
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
        {this._renderCheckbox()}
        {this._renderContent()}
      </div>
    )
  }

  private _renderCheckbox() {
    return (
      <div className={`${styles.row} ${styles.checklistItemWrapper} ${this.state.isAddable ? styles.addableItem : ''}`}
           onClick={e => this.toggleExpanded()}>
        <Checkbox
          className={styles.checklistItem}
          label={this.props.task.description.name}
          key={this.props.task.key}
          disabled={this.props.isAddable}
          onChange={(ev, checked) => this.props.onChange(checked)}
        />
        <ExpansionButton expanded={this.state.expanded}
                         icon={this.state.isAddable ? 'Add' : 'Info'}/>
      </div>
    )
  }

  private _renderContent() {
    return (
      <div className={`${styles.row} ${styles.checklistItemContent} ${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
        <div className={`${styles.checklistItemInfo} ${styles.threequarter_column}`}>
          <h2 className={styles.title}>Informationen</h2>
          <p>
            {this.props.task.description.detailText}
          </p>
        </div>
        <div className={styles.quarter_column}>
          <div className={`${styles.row} ${this.props.task.hasPOC() ? '' : styles.contentHidden}`}>
            <h2 className={styles.subTitle}>Ansprechpartner</h2>
            {this.props.task.getPOC()}
          </div>
          {// ToDo: wheres the attribute for Gesetze?!?!?!?!?!
          }
          <div className={`${styles.row} ${this.props.task.hasLinks() ? '' : styles.contentHidden}`}>
            <h2 className={styles.subTitle}>Regelung / Gesetz</h2>
          </div>
          <div className={`${styles.row} ${this.props.task.hasLinks() ? '' : styles.contentHidden}`}>
            <h2 className={styles.subTitle}>Links</h2>
          </div>
        </div>
      </div>
    )
  }

  private toggleExpanded() {
    if(this.state.isAddable) {
      this.props.onAddItem();
    } else {
      this.setState((current) => ({...current, expanded: !current.expanded}));
    }
  }
}
