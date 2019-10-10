import {Category, DienstpostenAuswahl, Preference, Task} from '../classes/Checklist';
import * as React from 'react';
import ChecklistSection from './ChecklistSection';
import api from '../api/api';
import {Dialog, DialogFooter, DialogType} from 'office-ui-fabric-react/lib/Dialog';
import styles from "./Rotationsplaner.module.scss";
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';

export interface ChecklistState {
  filteredCategories: Category[];
  showDeleteDialog: boolean;
}

export interface ChecklistProps {
  categories: Category[];
  preferences: Preference[];
  userPosts: DienstpostenAuswahl;
}

export class Checklist extends React.Component <ChecklistProps, ChecklistState> {
  constructor(props: ChecklistProps) {
    super(props);

    this.state = {
      filteredCategories: this.filterCategories(props.categories, props.preferences, props.userPosts),
      showDeleteDialog: false
    };
  }

  public componentWillReceiveProps({preferences, categories, userPosts}) {
    this.setState(prevState => ({...prevState,
      preferences: preferences,
      filteredCategories: this.filterCategories(categories, preferences, userPosts)
    }));
    // ToDo: filter tasks
  }

  public render(): React.ReactElement<{}> {
    return (
      <div>
        <h1>Ihr Rotationsplan</h1>
        <a className={styles.resetLink} onClick={this._showDeleteDialog.bind(this)}>Zurücksetzen</a>
        {this._renderDeleteDialog()}
        {this._renderCompletedCount()}
        {this.state.filteredCategories.map((cat: Category, index: number) =>
          <ChecklistSection
            tasks={cat.tasks}
            title={cat.name}
            key={cat.name}
            onTasksChange={this.handleSectionChange.bind(this, index)}
          />)}
        {/*<CollapseLikeButton
          title='Neue Kategorie hinzufügen'
          onClick={() => {
          }}
        />*/}
      </div>
    );
  }

  private _renderCompletedCount(): React.ReactElement<{}> {
    const tasks = this.state.filteredCategories.map(c => c.tasks).reduce((a, b) => a.concat(b), []);
    const nonArchivedTasks = tasks.filter(t => !t.isArchived);
    const completedCount: number = nonArchivedTasks.filter(t => t.checked).length;
    const taskCount: number = nonArchivedTasks.length;
    return <p>Aktuell haben Sie <b>{completedCount}</b> von <b>{taskCount}</b> Aufgaben erledigt.</p>;
  }

  private filterCategories(categories: Category[], preferences: Preference[], userPosts: DienstpostenAuswahl): Category[] {
    const activePreferences = preferences.filter(p => p.checked).map(p => p.name);
    const postPreferences: string[] = !!userPosts && userPosts.destination ? userPosts.destination.tags : [];
    activePreferences.push(...postPreferences);
    const categoriesWithFilteredTasks = categories.map(c =>
      new Category(c.name, c.tasksForPreferences(activePreferences))
    );
    // return categories with at least one task
    return categoriesWithFilteredTasks.filter(c => c.tasks.length > 0);
  }

  // private async onAddSection() : Promise<void> {
  //   const category = new Category();
  //   await api.postCategory(category);
  // }

  private handleSectionChange(index: number, newTasks: Task[]) : void {
    const categories: Category[] = this.state.filteredCategories;
    categories[index].tasks = newTasks;
    this.setState(prevState => ({...prevState, filteredCategories: categories}));
  }

  private _renderDeleteDialog(): React.ReactElement<{}> {
    return <Dialog
      isOpen={this.state.showDeleteDialog}
      type={DialogType.normal}
      isBlocking={true}
      title='Alle persönlichen Daten löschen?'
      subText='Hierdurch werden alle Eingaben zurückgesetzt und selbst angelegte Aufgaben gelöscht.'
    >
      <DialogFooter>
        <PrimaryButton onClick={() => this._closeDialog()} text="Abbrechen" />
        <DefaultButton onClick={() => this._deleteAllData()} text="Löschen" />
      </DialogFooter>
    </Dialog>;
  }

  private _showDeleteDialog(): void {
    this.setState(prevState => ({...prevState, showDeleteDialog: true }));
  }

  private async _deleteAllData(): Promise<void> {
    await api.deleteAllUserData().catch(e => alert('Fehler: ' + e.toString()));
    window.location.reload();
  }

  private _closeDialog(): void {
    this.setState(prevState => ({...prevState, showDeleteDialog: false }));
  }
}
