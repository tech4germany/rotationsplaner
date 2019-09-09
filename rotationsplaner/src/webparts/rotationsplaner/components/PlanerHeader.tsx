import * as React from "react";
import styles from "./Rotationsplaner.module.scss";

import * as Autocomplete from 'react-autocomplete';

const cities = ['Berlin', 'Pretoria', ' Other'];

export default class PlanerHeader extends React.Component < {} , {} > {
  public state = {rotateOrigin: ''}

  public render(): React.ReactElement<{}> {
    return(
            <section className={styles.header}>
              <h1 className={styles.title}>Ihr persönlicher Plan</h1>
              <p>Hier finden Sie die relevantesten Aufgaben und zugehörige Informationen und Formulare zu Ihrer Rotation
                von</p>
              {this.renderCityInput('Von')} nach {this.renderCityInput('Nach')}
              <p>Sollten sich Ihre Pläne ändern oder Aufgaben fehlen, fügen Sie diese unten hinzu. Ihr Arbeitsstand wird
                gespeichert, damit Sie jederzeit weitermachen können.</p>
            </section>
    );
  }

  private renderCityInput(label) {
    return(
      <div className={styles.autoComplete}>
        <Autocomplete
          getItemValue={(item) => item.label}
          items={cities.map(c => ({label: c}))}
          renderItem={(item, isHighlighted) =>
            <div className={`${styles.autoCompleteItem} ${isHighlighted ? styles.highlighted: ''}`}>
              {item.label}
            </div>
          }
          renderMenu={(children) => (
            <div className={`menu ${styles.autoCompleteMenu}`}>
              {children}
            </div>
          )}
          value={this.state.rotateOrigin}
          onChange={(e, val) => this.setState({rotateOrigin: val})}
          onSelect={(val) => this.setState({rotateOrigin: val})}
        />
      </div>
    )
  }

  private onChange(e) {
    console.log(e);
  }
}
