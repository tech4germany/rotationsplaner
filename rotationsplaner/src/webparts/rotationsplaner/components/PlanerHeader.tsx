import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {default as AutoComplete} from './AutoComplete';

import {Preference, PreferenceCategory} from '../classes/Checklist';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {ITag} from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagPicker';

const cityNames = ['Berlin', 'Pretoria', 'Kairo', 'Algier', 'Luanda', 'Malabo', 'Addis Abeba', 'Cotonou', 'Ouagadougou', 'Libreville', 'Accra'];
const cities: ITag[] = cityNames.map(s => ({key: s, name: s}));

export interface PlanerHeaderProps {
  preferences: Preference[];
  onPreferencesChanged: (preferences: Preference[]) => void;
}

export interface PlanerHeaderState {
  dependents: Preference[];
  items: Preference[];
}



class GridContainer extends React.Component < {className: string}, {} > {
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

export default class PlanerHeader extends React.Component < PlanerHeaderProps , PlanerHeaderState > {

  public constructor(props) {
    super(props);
    this.state = {
      dependents: this.props.preferences.filter(p => p.category == PreferenceCategory.dependents),
      items: this.props.preferences.filter(p => p.category == PreferenceCategory.items)
    };
  }

  public render(): React.ReactElement<{}> {
    return(
      <section className={styles.questionnaire}>
        <h1 className={styles.title}>In wenigen Schritten zum persönlichen Plan</h1>
        <p>Um Ihnen einen persönlichen Planer zu erstellen, benötigen wir ein paar kurze Informationen von Ihnen.
          Diese können Sie zu jedem späteren Zeitpunkt anpassen.</p>
        <GridContainer className={styles.questionnaireSubsection}>
          <div className={styles.halfColumnSm}>
            <span className={styles.header}>Von wo rotieren Sie?</span>
            <AutoComplete suggestions={cities} pickerSuggestionProps={{
              suggestionsHeaderText: 'Dienstorte',
              noResultsFoundText: 'Kein Ort gefunden'
            }}/>
          </div>
          <div className={styles.halfColumnSm}>
            <span className={styles.header}>Wohin werden Sie rotieren?</span>
            <AutoComplete suggestions={cities} pickerSuggestionProps={{
              suggestionsHeaderText: 'Dienstorte',
              noResultsFoundText: 'Kein Ort gefunden'
            }}/>
          </div>
        </GridContainer>
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
        <PrimaryButton className={styles.bigButton}
                       onClick={() => {
                         this.props.onPreferencesChanged([...this.state.items, ...this.state.dependents]);
                       }}
                       text='Angaben speichern'/>
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
