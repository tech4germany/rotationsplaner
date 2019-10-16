import {CustomTask, Task} from '../../classes/Checklist';
import * as React from 'react';
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from '../collapse/ExpansionButton';
import ChecklistItemDetails from './ItemDetails';
import {IconButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';

export interface IAdvancedChecklistItemProps {
  task: Task | CustomTask;
  checked?: boolean;
  editing?: boolean;
  onChange: (task: (Task | CustomTask)) => void;
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
    this.setState(prevState => ({
      ...prevState,
      checked: nextProps.checked,
      task: nextProps.task,
      editing: nextProps.editing
    }));
  }

  public render(): React.ReactElement<{}> {
    const expandedClass = this.state.expanded ? styles.expanded : '';
    return (
      <div className={`${styles.checklistItem} ${expandedClass}`}>
        {this._renderHeader()}
        {this._renderContent()}
      </div>
    );
  }

  private _renderHeader(): React.ReactElement<{}> {
    return (
      <div className={`${styles.checklistItemWrapper} ${this.state.task.checked ? styles.transparentItem : ''}`}
           onClick={this.state.task.hasDetails ? this.toggleExpanded.bind(this) : () => {}}>
        <div className={styles.checklistItemPrimary}>
          <Checkbox
            className={styles.checklistCheckbox}
            key={this.state.task.id}
            onChange={(ev, checked) => this.handleOnChange(ev, checked)}
            checked={this.state.task.checked}
            disabled={this.state.editing}
          />
          {this._renderInput()}
        </div>
        {this.renderExpansionButton()}
        <IconButton
          title='Aufgabe archivieren'
          className={styles.archiveButton}
          onClick={e => this.onArchiveTask(e)}
          iconProps={{iconName: 'Cancel'}}
        />
      </div>
    );
  }

  private renderExpansionButton(): React.ReactElement<{}> {
    if (this.state.task.hasDetails) {
      return <ExpansionButton className={styles.expandButton} expanded={this.state.expanded} icon='Info' />;
    } else {
      return null;
    }
  }

  private handleOnChange(ev: any, checked: boolean): void {
    const task: Task | CustomTask = this.state.task;
    task.checked = checked;
    this.props.onChange(task);
  }

  private _renderContent() : React.ReactElement<{}> {
    return (
      <div className={`${styles.checklistItemContent} ${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
        <ChecklistItemDetails
          task={this.props.task}
          onSave={task => this.saveTask(task)}
        />
      </div>
    );
  }

  private _renderInput(): React.ReactElement<{}> | undefined {
    const titleLabel = <span className={`${styles.primaryLabel} ${this.state.task.checked ? styles.strikeThrough : ''}`}>{this.state.task.title}</span>;
    if (this.state.task instanceof CustomTask) {
      if (!this.state.editing) {
        return <div className={styles.primaryLabel}>
          {titleLabel}
          <IconButton
            className={styles.checklistButton}
            iconProps={{iconName: 'Edit'}}
            onClick={e => this.toggleEditing(e)}
          />
        </div>;
      }
      return <CustomTaskTitleField
        value={this.state.task.title}
        onSave={value => this.handleTaskTitleChange(this.state.task as CustomTask, value)}
      />;
    } else {
      return titleLabel;
    }
  }

  private handleTaskTitleChange(task: CustomTask, value: string): void {
    task.title = value;
    this.saveTask(task);
  }

  private saveTask(task: CustomTask): void {
    if (!task.title || task.title.trim() == '') {
      return;
    }
    this.props.onChange(task);
    this.setState(prevState => ({...prevState, editing: false, task: task}));
  }

  private toggleEditing(event: React.MouseEvent<any>): void {
    event.stopPropagation();
    this.setState((current) => ({...current, editing: !current.editing}));
  }

  private onArchiveTask(event: any): void {
    // avoid propagation of click event to expand
    event.stopPropagation();

    const handler = this.props.onArchiveItem || this.props.onChange; // fallback for newly created tasks
    handler(this.state.task);
  }

  private toggleExpanded(): void {
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

  private handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      this.props.onSave(this.state.value);
    }
  }

  private handleInput(event: any): void {
    this.setState({value: event.target.value});
  }
}
