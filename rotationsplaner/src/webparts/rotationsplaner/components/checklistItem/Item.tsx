import {CustomTask, Task} from '../../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from '../collapse/ExpansionButton';
import ChecklistItemDetails from "./ItemDetails";
import {IconButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';

export interface IAdvancedChecklistItemProps {
  task: Task | CustomTask;
  checked?: boolean;
  editing?: boolean;
  onChange: (task: (Task | CustomTask)) => void;
  onAddItem?: () => void;
  onArchiveItem?: (task: (Task | CustomTask)) => void;
}

export interface AdvancedChecklistItemState {
  checked: boolean;
  expanded: boolean;
  editing: boolean;
  task: Task | CustomTask;
}

export default class ChecklistItem extends React.Component <IAdvancedChecklistItemProps, AdvancedChecklistItemState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      checked: this.props.checked || false,
      expanded: false,
      editing: this.props.editing || false,
      task: this.props.task
    };
  }

  public componentWillReceiveProps(nextProps: IAdvancedChecklistItemProps, nextContext: any): void {
    this.setState(prevState => ({...prevState, checked: nextProps.checked, task: nextProps.task, editing: nextProps.editing}));
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
      <div className={`${styles.row} ${styles.checklistItemWrapper}`}
           onClick={this.toggleExpanded.bind(this)}>
        <div className={styles.checklistItemPrimary}>
          <Checkbox
            className={styles.checklistCheckbox}
            label={this.state.editing ? undefined : this.state.task.title}
            key={this.state.task.id}
            onChange={(ev, checked) => this.handleOnChange(ev, checked)}
            checked={this.state.task.checked}
            disabled={this.state.editing}
          />
          {this._renderInput()}
        </div>
        <ExpansionButton expanded={this.state.expanded}
                         icon='Info'/>
        <ExpansionButton
          className={styles.archiveButton}
          expanded={false}
          onClick={e => this.onArchiveTask(e)}
          icon='Cancel'
        />
      </div>
    );
  }

  private handleOnChange(ev: any, checked: boolean) {
    const task = this.state.task;
    task.checked = checked;
    this.props.onChange(task);
  }

  private _renderContent() {
    return (
      <div className={`${styles.checklistItemContent} ${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
        <ChecklistItemDetails
          task={this.props.task}
          onSave={task => this.props.onChange(task)}
        />
      </div>
    );
  }

  private _renderInput(): React.ReactElement<{}> | undefined {
    if(!(this.state.task instanceof CustomTask)) return undefined;

    if (!this.state.editing)
      return <IconButton className={styles.checklistButton} icon='Edit' onClick={e => this.toggleEditing(e)}/>;
    return <CustomTaskTitleField
      value={this.state.task.title}
      onSave={value => this.handleOnSave(this.state.task as CustomTask, value)}
    />;
  }


  private handleOnSave(task: CustomTask, value: string) {
    task.title = value;
    this.props.onChange(task);
    // TODO: is the following necessary?
    this.setState(prevState => ({...prevState, editing: false, task: task}));
  }

  private toggleEditing(event: React.MouseEvent<any>) {
    event.stopPropagation();
    this.setState((current) => ({...current, editing: !current.editing}));
  }

  private onArchiveTask(event: any) {
    console.log('onArchiveTask');
    // avoid propagation of click event to expand
    event.stopPropagation();

    this.props.onArchiveItem(this.state.task);
  }

  private toggleExpanded() {
    this.setState((current) => ({...current, expanded: !current.expanded}));
  }
}

interface ICustomTaskTitleFieldProps {
  value: string;
  onSave: (newValue: string) => void;
}

class CustomTaskTitleField extends React.Component <ICustomTaskTitleFieldProps, {value: string}> {
  public state = {value: this.props.value};

  public render(): React.ReactElement<{value: string}> {
    return <div>
      <input
        type='text'
        autoFocus={true}
        placeholder='Name der Aufgabe eingeben'
        value={this.state.value}
        onChange={e => this.handleInput(e)}
        onKeyDown={e => this.handleKeyDown(e)}
        onClick={e => e.stopPropagation()}
      />
      <PrimaryButton
        text='Speichern'
        className={styles.editSaveButton}
        disabled={this.state.value.length === 0}
        onClick={e => {
          e.stopPropagation();
          this.props.onSave(this.state.value);
        }}
      />
    </div>;
  }

  private handleKeyDown(event: any) {
    if (event.key === 'Enter') {
      this.props.onSave(this.state.value);
    }
  }

  private handleInput(event: any): void {
    this.setState({value: event.target.value});
  }
}
