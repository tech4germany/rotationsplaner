import {CustomTask, HTML, Task} from '../../classes/Checklist';
import * as React from 'react';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import styles from '../Rotationsplaner.module.scss';
import {PrimaryButton} from 'office-ui-fabric-react/lib/Button';

export interface IChecklistItemDetailsProps {
  task: Task | CustomTask;
  onSave: (task: CustomTask) => void;
}

export interface IChecklistItemDetailsState {
  text?: string;
}

export default class ChecklistItemDetails extends React.Component <IChecklistItemDetailsProps, IChecklistItemDetailsState> {
  public state: IChecklistItemDetailsState = {
    text: this.props.task.detailText
  };

  public render(): React.ReactElement<IChecklistItemDetailsState> {
    return (
      <div className={styles.row}>
        {this._renderDetails()}
        {ChecklistItemDetails._renderSideDetails(this.props.task)}
      </div>
    );
  }

  private _renderDetails(): React.ReactElement<{}> {
    const task = this.props.task;
    if (task instanceof Task && !task.detailText) {
      return null;
    }
    return <div className={`${styles.threequarter_column} ${styles.itemDetails}`}>
      {this._renderDetailsContent()}
    </div>;
  }

  private _renderDetailsContent(): React.ReactElement<{}> {
    if (this.props.task instanceof Task) {
      return this._renderTaskDetails(this.props.task);
    } else if (this.props.task instanceof CustomTask) {
      return this._renderCustomTaskDetails();
    }
  }

  private _renderCustomTaskDetails(): React.ReactElement<{}> {
    return <div>
      <h2 className={styles.title}>Notizen</h2>
      <TextField
        multiline
        autoAdjustHeight
        defaultValue={this.props.task.detailText}
        onChanged={newValue => this.setState({text: newValue})}
      />
      <PrimaryButton
        text={'Speichern'}
        disabled={this.state.text === this.props.task.detailText}
        onClick={e => {
          const task: CustomTask = this.props.task as CustomTask;
          task.detailText = this.state.text;
          this.props.onSave(task);  // TODO catch errors
        }}
      />
    </div>;
  }

  private _renderTaskDetails(task: Task): React.ReactElement<{}> {
    return (<div>
      <h2 className={styles.title}>Informationen</h2>
      <p className={styles.editorProvidedContent} dangerouslySetInnerHTML={{__html: task.detailText}}/>
    </div>);
  }

  private static _renderSideDetails(task: Task | CustomTask): React.ReactElement<{}> | undefined {
    if (!(task instanceof Task)) {
      return undefined;
    }

    return <div className={styles.quarter_column}>
      <DetailItem title={'Ansprechpartner'} content={ChecklistItemDetails.contactDetailsHTML(task)} />
      <DetailItem title={'Formulare'} content={ChecklistItemDetails.addingTargetBlankToLinks(task.form)} />
      <DetailItem title={'Sonstige Anlagen'} content={ChecklistItemDetails.addingTargetBlankToLinks(task.ordinance)} />
    </div>;
  }

  private static contactDetailsHTML(task: Task): HTML {
    if (!task.pointsOfContact) {
      return '';
    }
    const items: string[] = task.pointsOfContact.map(c => `<a href="${c.url}" target="_blank">${c.name}</a>`);
    return items.join('<br>');
  }

  private static addingTargetBlankToLinks(html?: string): string {
    if(!html) {
      return '';
    }
    return ('' + html).replace(/<a\s+href=/gi, '<a target="_blank" href=');
  }
}

class DetailItem extends React.Component <{title: string, content: HTML}, {}> {
  public render(): React.ReactElement<{}> {
    if (!this.props.content || this.props.content.length == 0) {
      return null;
    }

    return <div className={styles.row}>
      <h2 className={styles.subTitle}>{this.props.title}</h2>
      <p className={styles.editorProvidedContentAside} dangerouslySetInnerHTML={{__html: this.props.content}}/>
    </div>;
  }
}
