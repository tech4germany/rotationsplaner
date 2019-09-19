import {Category, Preference} from "../classes/Checklist";
import * as React from "react";
import ChecklistSection from "./ChecklistSection";

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

  private categories: Category[] = [];

  componentWillReceiveProps({preferences}) {
    this.setState(prevState => ({...prevState,
      preferences: preferences,
      filteredCategories: this.filterCategories(this.props.categories, preferences)
    }));
    // ToDo: filter tasks
  }

  private filterCategories(categories: Category[], preferences: Preference[]): Category[] {
    const activePreferences = preferences.filter(p => p.checked).map(p => p.name);
    const categoriesWithFilteredTasks = categories.map(c => {
      const tasks = c.tasks.filter(t => {
        if (t.description.showOnlyFor === undefined) return true;
        const containedInPreferences = activePreferences.indexOf(t.description.showOnlyFor) != -1;
        return containedInPreferences;
      });
      const category = {name: c.name, tasks: tasks};
      return category;
    });
    const relevantCategories = categoriesWithFilteredTasks.filter(c => c.tasks.length > 0);

    return relevantCategories;
  }

  public render(): React.ReactElement<{}> {
    const completedCount = this.state.filteredCategories.map(c => c.tasks.filter(t => t.checked).length).reduce((a, b) => a + b, 0);
    const taskCount = this.state.filteredCategories.map(c => c.tasks.length).reduce((a, b) => a + b, 0);
    return (
      <div>
        <p>Aktuell haben Sie <b>{completedCount}</b> von <b>{taskCount}</b> empfohlenen Aufgaben erledigt.</p>
        {this.state.filteredCategories.map((cat: Category, index: number) =>
          <ChecklistSection
            tasks={cat.tasks}
            title={cat.name}
            key={cat.name}
            onTasksChange={this.handleSectionChange.bind(this, index)}
          />)}
      </div>
    );
  }

  private handleSectionChange(index, newTasks) {
    const categories = this.state.filteredCategories;
    categories[index].tasks = newTasks;
    this.setState(prevState => ({...prevState, filteredCategories: categories}));
  }
}
