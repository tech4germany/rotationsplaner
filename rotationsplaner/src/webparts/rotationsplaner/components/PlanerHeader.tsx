import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import {default as AutoComplete} from './AutoComplete';

import ChecklistItem from './AdvancedChecklistItem'
import {Task} from "../classes/Checklist";

const cities = ['Berlin', 'Pretoria'];

const fakeTask = new Task({
    id: "1",
    name: "Speditionen anfragen",
    isCustom: false,
    detailText: "Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können",
    pointOfContact: {
      name: '113-2 Beihilfestelle'
    }
  }, false, undefined);

export default class PlanerHeader extends React.Component < {} , {} > {

  public render(): React.ReactElement<{}> {
    return(
            <section className={styles.header}>
              <h1 className={styles.title}>Ihr persönlicher Plan</h1>
              <p>Hier finden Sie die relevantesten Aufgaben und zugehörige Informationen und Formulare zu Ihrer Rotation
                von</p>
              <AutoComplete suggestions={cities}/> nach <AutoComplete suggestions={cities}/>
              <p>Sollten sich Ihre Pläne ändern oder Aufgaben fehlen, fügen Sie diese unten hinzu. Ihr Arbeitsstand wird
                gespeichert, damit Sie jederzeit weitermachen können.</p>
              <ChecklistItem checked={false} task={fakeTask} onChange={(checked) => console.log(checked)}/>
            </section>
    );
  }
}
