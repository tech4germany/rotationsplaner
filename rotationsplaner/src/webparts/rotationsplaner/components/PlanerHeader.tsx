import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {default as AutoComplete} from './AutoComplete';

import {Preference, Task} from '../classes/Checklist';
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';

const cities = ['Berlin', 'Pretoria'];

const fakeTask = new Task({
    id: '1',
    name: 'Speditionen anfragen',
    isCustom: false,
    detailText: 'Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können',
    pointOfContact: {
      name: '113-2 Beihilfestelle'
    }
  }, false, undefined);

export interface PlanerHeaderState {
  preferences: Array<Preference>;
}

const defaultPreferences: Array<Preference> = [
  {name: 'partner', description: 'Partner_in', checked: true},
  {name: 'children_younger', description: 'Jüngere Kinder', checked: false}
];

export default class PlanerHeader extends React.Component < {} , PlanerHeaderState > {

  public state: PlanerHeaderState = {
    preferences: defaultPreferences
  };

  public render(): React.ReactElement<{}> {
    return(
      <section className={styles.header}>
        <h1 className={styles.title}>In wenigen Schritten zum persönlichen Plan</h1>
        <p>Um Ihnen einen persönlichen Planer zu erstellen, benötigen wir ein paar kurze Informationen von Ihnen.
          Diese können Sie zu jedem späteren Zeitpunkt anpassen.</p>
        <div className={styles.questionnaireSubsection}>
          <div className={styles['ms-Grid']} dir='ltr'>
            <div className={styles.row}>
              <div className={styles['half-column-sm']}>
                <span className={styles.header}>Von wo rotieren Sie?</span>
                <AutoComplete suggestions={cities}/>
              </div>
              <div className={styles['half-column-sm']}>
                <span className={styles.header}>Wohin werden Sie rotieren?</span>
                <AutoComplete suggestions={cities}/>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.questionnaireSubsection}>
          <span className={styles.header}>Wer wird mit Ihnen rotieren?</span>
          <p>Entsprechende bitte anklicken</p>
          {this.getButtons()}
        </div>
        <p>Sollten sich Ihre Pläne ändern oder Aufgaben fehlen, fügen Sie diese unten hinzu. Ihr Arbeitsstand wird
          gespeichert, damit Sie jederzeit weitermachen können.</p>
      </section>
    );
  }

  private getButtons() {
    return this.state.preferences.map((p, index) =>
      <DefaultButton
        toggled={p.checked}
        text={p.description}
        key={p.name}
        onClick={this.onPreferenceClicked.bind(this, index)}
      />);
  }

  private onPreferenceClicked(index: number) {
    const preferences = this.state.preferences;
    preferences[index].checked = !preferences[index].checked;
    this.setState(prevState => ({...prevState, preferences: preferences}));
  }
}
