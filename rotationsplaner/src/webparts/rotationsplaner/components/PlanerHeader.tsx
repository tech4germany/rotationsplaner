import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import { TextField } from 'office-ui-fabric-react/lib/TextField';

const cities = ['Berlin', 'Pretoria'];

export default class PlanerHeader extends React.Component < {} , {} > {
  public render(): React.ReactElement<{}> {
    return(
            <section className={styles.header}>
              <h1 className={styles.title}>Ihr persönlicher Plan</h1>
              <p>Hier finden Sie die relevantesten Aufgaben und zugehörige Informationen und Formulare zu Ihrer Rotation
                von <b>Berlin</b> nach <b>Pretoria</b>.</p>
              <p>Sollten sich Ihre Pläne ändern oder Aufgaben fehlen, fügen Sie diese unten hinzu. Ihr Arbeitsstand wird
                gespeichert, damit Sie jederzeit weitermachen können.</p>
            </section>
    );
  }

  // private renderCityInput(label) {
  //   return(
  //     <TextField autoComplete={cities}
  //                 label={}
  //                 placeholder={} />
  //   )
  // }
}
