import * as React from 'react';
import styles from './Rotationsplaner.module.scss';

import {Preference, PreferenceCategory, UserDienstorte} from '../classes/Checklist';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {ITag} from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagPicker';
import Collapse from './collapse/Collapse';
import PostsAutoComplete from "./PostsAutoComplete";

const cityNames: string[] = ['Berlin', 'Pretoria', 'Kairo', 'Algier', 'Luanda', 'Malabo', 'Addis Abeba', 'Cotonou', 'Ouagadougou', 'Libreville', 'Accra'];
const cities: ITag[] = cityNames.map(s => ({key: s, name: s}));

export interface IPlanerHeaderProps {
  preferences: Preference[];
  onPreferencesChanged: (preferences: Preference[], posts: UserDienstorte) => void;
  selectedPosts: UserDienstorte;
}

export interface IPlanerHeaderState {
  dependents: Preference[];
  items: Preference[];
  isExpanded: boolean;
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

export default class PlanerHeader extends React.Component<IPlanerHeaderProps, IPlanerHeaderState > {

  private selectedPosts: UserDienstorte = this.props.selectedPosts;

  public constructor(props) {
    super(props);
    this.state = {
      dependents: this.props.preferences.filter(p => p.category === PreferenceCategory.dependents),
      items: this.props.preferences.filter(p => p.category === PreferenceCategory.items),
      isExpanded: true
    };
  }



  public render(): React.ReactElement<IPlanerHeaderProps> {
    return(
      <section>
        <Collapse expanded={this.state.isExpanded} title='Persönliche Angaben' className={styles.questionnaireSection}>
          <div className={styles.questionnaire}>
            <p className={styles.questionnaireSubsection}>
              Um Ihnen einen persönlichen Planer zu erstellen, benötigen wir ein paar kurze Informationen von Ihnen.
              Diese können Sie zu jedem späteren Zeitpunkt anpassen.
            </p>
            <GridContainer className={styles.questionnaireSubsection}>
              <PostsAutoComplete
                selectedPosts={this.props.selectedPosts}
                onChangePosts={posts => this.selectedPosts = posts}
              />
            </GridContainer>
            <div className={styles.questionnaireSubsection}>
              <span className={styles.question}>Wer wird mit Ihnen rotieren?</span>
              <p>Entsprechende bitte anklicken</p>
              {this.makeButtons(this.state.dependents, this.onDependentPreferenceClicked.bind(this))}
            </div>
            <div className={styles.questionnaireSubsection}>
              <span className={styles.question}>Was planen Sie mitzunehmen?</span>
              <p>Entsprechende bitte anklicken</p>
              {this.makeButtons(this.state.items, this.onItemPreferenceClicked.bind(this))}
            </div>
            <div className={styles.questionnaireSubsection}>
              <PrimaryButton
                className={styles.bigButton}
                onClick={this.onSavePreferences.bind(this)}
                text='Angaben speichern'
              />
            </div>
          </div>
        </Collapse>
      </section>
    );
  }

  private onSavePreferences(): void {
    this.setState(prevState => ({...prevState, isExpanded: false}));
    this.props.onPreferencesChanged([...this.state.items, ...this.state.dependents], this.selectedPosts);
  }

  private makeButtons(preferences: Array<Preference>, onClick: (number: number) => void): React.ReactElement<{}> {
    return <div className={styles.toggleButtonGroup}>
      {preferences.map((p, index) =>
        <DefaultButton
          toggled={p.checked}
          text={p.name}
          key={p.name}
          onClick={() => onClick(index)}
          className={p.checked ? styles.isToggled : ''}
        />)}
    </div>;
  }

  private onDependentPreferenceClicked(index: number): void {
    const preferences: Preference[] = this.state.dependents;
    preferences[index].checked = !preferences[index].checked;
    this.setState(prevState => ({...prevState, dependents: preferences, isExpanded: true}));
  }

  private onItemPreferenceClicked(index: number): void {
    const preferences: Preference[] = this.state.items;
    preferences[index].checked = !preferences[index].checked;
    this.setState(prevState => ({...prevState, items: preferences, isExpanded: true}));
  }
}
