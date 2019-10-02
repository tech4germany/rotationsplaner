import {Category, Preference} from '../classes/Checklist';
import * as React from 'react';
import ChecklistSection from './ChecklistSection';
import api from '../api/api';
import CollapseLikeButton from './collapse/CollapseLikeButton';
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
}

export class Checklist extends React.Component <ChecklistProps, ChecklistState> {
  constructor(props: ChecklistProps) {
    super(props);

    this.state = {
      filteredCategories: this.filterCategories(props.categories, props.preferences),
      showDeleteDialog: false
    };
  }

  public componentWillReceiveProps({preferences, categories}) {
    this.setState(prevState => ({...prevState,
      preferences: preferences,
      filteredCategories: this.filterCategories(categories, preferences)
    }));
    // ToDo: filter tasks
  }

  public render(): React.ReactElement<{}> {
    const completedCount = this.state.filteredCategories.map(c => c.tasks.filter(t => t.checked).length).reduce((a, b) => a + b, 0);
    const taskCount = this.state.filteredCategories.map(c => c.tasks.length).reduce((a, b) => a + b, 0);
    return (
      <div>
        <h1>Ihr Rotationsplan</h1>
        <a className={styles.resetLink} onClick={this._showDeleteDialog.bind(this)}>Zurücksetzen</a>
        {this._renderDeleteDialog()}
        <p>Aktuell haben Sie <b>{completedCount}</b> von <b>{taskCount}</b> Aufgaben erledigt.</p>
        {this.state.filteredCategories.map((cat: Category, index: number) =>
          <ChecklistSection
            tasks={cat.tasks}
            title={cat.name}
            key={cat.name}
            onTasksChange={this.handleSectionChange.bind(this, index)}
          />)}
        <CollapseLikeButton
          title='Neue Kategorie hinzufügen'
          onClick={() => {}}
        />
      </div>
    );
  }

  private filterCategories(categories: Category[], preferences: Preference[]): Category[] {
    const activePreferences = preferences.filter(p => p.checked).map(p => p.name);
    const categoriesWithFilteredTasks = categories.map(c => {
      const tasks = c.tasksForPreferences(preferences);
      return new Category(c.name, tasks);
    });
    const relevantCategories = categoriesWithFilteredTasks.filter(c => c.tasks.length > 0);

    return relevantCategories;
  }

  // private async onAddSection() : Promise<void> {
  //   const category = new Category();
  //   await api.postCategory(category);
  // }

  private handleSectionChange(index, newTasks) : void {
    const categories = this.state.filteredCategories;
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
