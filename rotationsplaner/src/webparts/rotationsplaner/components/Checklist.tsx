import {Category, Preference} from '../classes/Checklist';
import * as React from 'react';
import ChecklistSection from './ChecklistSection';
import api from '../api/api';
import CollapseLikeButton from './collapse/CollapseLikeButton';

export interface ChecklistState {
  filteredCategories: Category[];
}

export interface ChecklistProps {
  categories: Category[];
  preferences: Preference[];
}

export class Checklist extends React.Component <ChecklistProps, ChecklistState> {
  constructor(props: ChecklistProps) {
    super(props);

    this.state = {
      filteredCategories: this.filterCategories(props.categories, props.preferences)
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
          onClick={this.onAddSection.bind(this)}
        />
      </div>
    );
  }

  private filterCategories(categories: Category[], preferences: Preference[]): Category[] {
    const activePreferences = preferences.filter(p => p.checked).map(p => p.name);
    const categoriesWithFilteredTasks = categories.map(c => {
      const tasks = c.tasks.filter(t => {
        if (t.showOnlyFor === undefined || t.showOnlyFor === null) return true;
        const containedInPreferences = activePreferences.indexOf(t.showOnlyFor) != -1;
        return containedInPreferences;
      });
      const category = {name: c.name, tasks: tasks};
      return category;
    });
    const relevantCategories = categoriesWithFilteredTasks.filter(c => c.tasks.length > 0);

    return relevantCategories;
  }

  private async onAddSection() {
    const category = new Category();
    await api.postCategory(category);
  }

  private handleSectionChange(index, newTasks) {
    const categories = this.state.filteredCategories;
    categories[index].tasks = newTasks;
    this.setState(prevState => ({...prevState, filteredCategories: categories}));
  }
}
