import {CustomTask, Task} from '../classes/Checklist';
import * as React from 'react';
import styles from './Rotationsplaner.module.scss';

export interface IChecklistItemDetailsState {
}

export interface IChecklistItemDetailsProps {
  task: Task | CustomTask;
}

export default class ChecklistItemDetails extends React.Component <IChecklistItemDetailsProps, IChecklistItemDetailsState> {

  public render(): React.ReactElement<IChecklistItemDetailsState> {
    return (
      <div className={styles.row}>
        <div className={`${styles.checklistItemInfo} ${styles.threequarter_column}`}>
          <h2 className={styles.title}>Informationen</h2>
          <p>
            {this.props.task.detailText}
          </p>
        </div>
        {this.props.task instanceof Task
          ? this.renderSideDetails(this.props.task)
          : undefined
        }
      </div>
    );
  }

  private renderSideDetails(task: Task) {
    return <div className={styles.quarter_column}>
      <div className={`${styles.row} ${task.hasPOC() ? '' : styles.contentHidden}`}>
        <h2 className={styles.subTitle}>Ansprechpartner</h2>
        {task.getPOC()}
      </div>
      {// ToDo: wheres the attribute for Gesetze?!?!?!?!?!
      }
      <div className={`${styles.row} ${task.hasLinks() ? '' : styles.contentHidden}`}>
        <h2 className={styles.subTitle}>Regelung / Gesetz</h2>
      </div>
      <div className={`${styles.row} ${task.hasLinks() ? '' : styles.contentHidden}`}>
        <h2 className={styles.subTitle}>Links</h2>
      </div>
    </div>;
  }
}
