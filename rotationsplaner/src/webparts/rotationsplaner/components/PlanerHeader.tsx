import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {default as AutoComplete} from './AutoComplete';

import {Preference} from '../classes/Checklist';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';

const cities = ['Berlin', 'Pretoria', 'Kairo', 'Algier', 'Luanda', 'Malabo', 'Addis Abeba', 'Cotonou', 'Ouagadougou', 'Libreville', 'Accra'];

export interface PlanerHeaderState {
  dependents: Array<Preference>;
  items: Array<Preference>;
}

const defaultDependentPreferences: Array<Preference> = [
  {name: 'partner', description: 'Partner_in', checked: true},
  {name: 'children_younger', description: 'Jüngere Kinder', checked: false},
  {name: 'children_school', description: 'Schulpflichtige Kinder', checked: false},
  {name: 'children_higher_ed', description: 'Studierende Kinder', checked: false},
  {name: 'familymembers_other', description: 'Sonstige Familienangehörige', checked: false}
];

const defaultItemPreferences: Array<Preference> = [
  {name: 'household_full', description: 'Gesamter Haushalt', checked: false},
  {name: 'household_partial', description: 'Nur Teile des Haushalts', checked: true},
  {name: 'vehicles', description: 'Fahrzeuge', checked: false},
  {name: 'pets', description: 'Haustiere', checked: false},
];

class TwoColumnContainer extends React.Component < {className: string}, {} > {
  public render(): React.ReactElement<{}> {
    return (
      <div className={this.props.className}>
        <div className={styles['ms-Grid']} dir='ltr'>
          <div className={styles.row}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default class PlanerHeader extends React.Component < {} , PlanerHeaderState > {

  public state: PlanerHeaderState = {
    dependents: defaultDependentPreferences,
    items: defaultItemPreferences
  };

  public render(): React.ReactElement<{}> {
    return(
      <section className={styles.questionnaire}>
        <h1 className={styles.title}>In wenigen Schritten zum persönlichen Plan</h1>
        <p>Um Ihnen einen persönlichen Planer zu erstellen, benötigen wir ein paar kurze Informationen von Ihnen.
          Diese können Sie zu jedem späteren Zeitpunkt anpassen.</p>
        <TwoColumnContainer className={styles.questionnaireSubsection}>
          <div className={styles.halfColumnSm}>
            <span className={styles.header}>Von wo rotieren Sie?</span>
            <AutoComplete suggestions={cities}/>
          </div>
          <div className={styles.halfColumnSm}>
            <span className={styles.header}>Wohin werden Sie rotieren?</span>
            <AutoComplete suggestions={cities}/>
          </div>
        </TwoColumnContainer>
        <div className={styles.questionnaireSubsection}>
          <span className={styles.header}>Wer wird mit Ihnen rotieren?</span>
          <p>Entsprechende bitte anklicken</p>
          {this.makeButtons(this.state.dependents, this.onDependentPreferenceClicked)}
        </div>
        <div className={styles.questionnaireSubsection}>
          <span className={styles.header}>Was planen Sie mitzunehmen?</span>
          <p>Entsprechende bitte anklicken</p>
          {this.makeButtons(this.state.items, this.onItemPreferenceClicked)}
        </div>
        <PrimaryButton className={styles.bigButton} text='Angaben speichern'/>
      </section>
    );
  }



  private makeButtons(preferences: Array<Preference>, onClick: (number) => void) {
    return <div className={styles.toggleButtonGroup}>
      {preferences.map((p, index) =>
        <DefaultButton
          toggled={p.checked}
          text={p.description}
          key={p.name}
          onClick={onClick.bind(this, index)}
          className={p.checked ? styles.isToggled : ''}
        />)}
    </div>;
  }

  private onDependentPreferenceClicked(index: number) {
    const preferences = this.state.dependents;
    preferences[index].checked = !preferences[index].checked;
    this.setState(prevState => ({...prevState, dependents: preferences}));
  }

  private onItemPreferenceClicked(index: number) {
    const preferences = this.state.items;
    preferences[index].checked = !preferences[index].checked;
    this.setState(prevState => ({...prevState, items: preferences}));
  }
}
