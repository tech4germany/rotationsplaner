import {Task} from "../classes/Checklist";
import * as React from "react";
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import styles from "./Rotationsplaner.module.scss";

import ExpansionButton from './ExpansionButton';

export interface AdvancedChecklistItemState {
  checked: boolean;
  expanded: boolean;
}

export interface IAdvancedChecklistItemProps {
  checked: boolean;
  task: Task;
  onChange: (checked: boolean) => void;
}

export default class Checklist extends React.Component <IAdvancedChecklistItemProps, AdvancedChecklistItemState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      checked: false,
      expanded: false
    };
  }

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.container}>
        {this._renderCheckbox()}
        <div className={`${styles.row} ${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
          <div className={`${styles.checklistItemInfo} ${styles.threequarter_column}`}>
            <h2 className={styles.title}>Informationen</h2>
            <p>
              {this.props.task.description.detailText}
            </p>
          </div>
          <div className={styles.quarter_column}>
            <div className={styles.row}>
              <h2 className={styles.subTitle}>Ansprechpartner</h2>
              {this.props.task.description.pointOfContact.name}
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
      </div>
    )
  }

  private _renderCheckbox() {
    return (
      <div className={`${styles.row} ${styles.checklistItemWrapper}`}
           onClick={e => this.toggleExpanded()}>
        <Checkbox
          className={styles.checklistItem}
          label={this.props.task.description.name}
          onChange={(ev, checked) => this.props.onChange(checked)}
        />
        <ExpansionButton expanded={this.state.expanded}
                         icon={'Info'}/>
      </div>
    )
  }

  private toggleExpanded() {
    this.setState((current) => ({...current, expanded: !current.expanded}));
  }
}
