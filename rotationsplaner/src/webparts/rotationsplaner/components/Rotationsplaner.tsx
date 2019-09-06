import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { IRotationsplanerProps } from './IRotationsplanerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ChecklistSection from './ChecklistSection';
import {Category, Task} from '../classes/Checklist';

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

interface ChecklistState {
  categories: Category[];
}

class Checklist extends React.Component < {}, ChecklistState > {
  constructor(props: {}) {
    super(props);


    this.state = {
      categories: [umzug, wohnung]
    };
  }

  public render(): React.ReactElement<{}> {
    return (
      <div>
        <p>Aktuell haben Sie <b>0</b> von <b>54</b> empfohlenen Aufgaben erledigt.</p>
        {this.state.categories.map((cat: Category) =>
          <ChecklistSection tasks={cat.tasks} title={cat.name} key={cat.name}/>)}
      </div>
    );
  }
}

export default class Rotationsplaner extends React.Component < IRotationsplanerProps, {} > {
  public render(): React.ReactElement<IRotationsplanerProps> {
    return(
      <div className={styles.rotationsplaner}>
        <div className={styles.container}>
          <div className={styles.row}>
            <section className={styles.header}>
              <h1 className={styles.title}>Ihr persönlicher Plan</h1>
              <p>Hier finden Sie die relevantesten Aufgaben und zugehörige Informationen und Formulare zu Ihrer Rotation
                von <b>Berlin</b> nach <b>Pretoria</b>.</p>

              <p>Sollten sich Ihre Pläne ändern oder Aufgaben fehlen, fügen Sie diese unten hinzu. Ihr Arbeitsstand wird
                gespeichert, damit Sie jederzeit weitermachen können.</p>
            </section>
          </div>
          <div className={styles.row}>
            <Checklist/>
          </div>
        </div>
      </div>
    );
  }
}
