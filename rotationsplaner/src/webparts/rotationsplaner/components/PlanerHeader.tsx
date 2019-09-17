import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import {default as AutoComplete} from './AutoComplete';


const cities = ['Berlin', 'Pretoria'];

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
            </section>
    );
  }
}
