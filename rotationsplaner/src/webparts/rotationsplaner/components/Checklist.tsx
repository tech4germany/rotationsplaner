import {Category, Task} from "../classes/Checklist";
import * as React from "react";
import ChecklistSection from "./ChecklistSection";

const umzug: Category = {
  name: 'Umzug',
  tasks: [
    new Task({
      id: "1",
      name: "Speditionen anfragen",
      isCustom: false,
      detailText: "Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können"
    }, false, undefined),
    new Task({
      id: "2",
      name: "WBR beantragen",
      detailText: "Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.",
      isCustom: false,
      links: [{description: "WBR Formular", uri: "http://forms.diplo.com"}]
    }, false, undefined)
  ]
};
const wohnung: Category = {
  name: 'Wohnung',
  tasks: [
    new Task({
      id: "w1",
      name: "Maklertermine vereinbaren",
      isCustom: false,
    }, false, undefined),
    new Task({
        id: "w2",
        name: "Mietspiegel überprüfen",
        isCustom: false,
        links: []
      },
      false, undefined)
  ]
};

export interface ChecklistState {
  categories: Category[];
}

export class Checklist extends React.Component <{}, ChecklistState> {
  constructor(props: {}) {
    super(props);


    this.state = {
      categories: [umzug, wohnung]
    };
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
