import {Category, Task} from "../classes/Checklist";
import * as React from "react";
import ChecklistSection from "./ChecklistSection";
import api from '../api/api';

export interface ChecklistState {
  categories: Category[];
}

export class Checklist extends React.Component <{}, ChecklistState> {
  constructor(props: {}) {
    super(props);


    this.state = {
      categories: []
    };
  }

  async componentDidMount(){
    const categories = await api.fetchCategories()
    this.setState(oldState => ({...oldState, categories}));
  }

  public render(): React.ReactElement<{}> {
    const completedCount = this.state.categories.map(c => c.tasks.filter(t => t.checked).length).reduce((a, b) => a + b, 0);
    const taskCount = this.state.categories.map(c => c.tasks.length).reduce((a, b) => a + b, 0);
    return (
      <div>
        <p>Aktuell haben Sie <b>{completedCount}</b> von <b>{taskCount}</b> empfohlenen Aufgaben erledigt.</p>
        {this.state.categories.map((cat: Category, index: number) =>
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
    const categories = this.state.categories;
    categories[index].tasks = newTasks;
    this.setState(prevState => ({...prevState, categories: categories}));
  }
}
