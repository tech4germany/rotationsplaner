import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IRotationsplanerProps} from './IRotationsplanerProps';
import {Checklist} from './Checklist';
import {default as PlanerHeader} from './PlanerHeader';
import api from '../api/api';
import {Category, Preference} from '../classes/Checklist';

export interface RotationsplanerState {
  categories: Category[];
  preferences: Preference[];
}


export default class Rotationsplaner extends React.Component < IRotationsplanerProps, RotationsplanerState > {
  public state: RotationsplanerState = {
    categories: null,
    preferences: null
  };

  public async componentDidMount(){
    this.fetchCategories().catch(console.error);
    this.fetchPreferences().catch(console.error);
  }

  private async fetchCategories() {
    const categories = await api.fetchCategories();
    this.setState(prevState => ({...prevState, categories: categories}));
  }

  private async fetchPreferences() {
    const preferences = await api.fetchPreferences();
    this.setState(prevState => ({...prevState, preferences: preferences}));
  }

  public render(): React.ReactElement<IRotationsplanerProps> {
    return(
      <div className={styles.rotationsplaner}>
        <h1>Willkommen {this.props.userName},</h1>
        <p>Wir helfen Ihnen dabei, alle relevanten Informationen, Formulare, und To-Dos zu finden. Außerdem unterstützen wir Sie dabei, Ihre individuelle Checkliste anzulegen.</p>
        <p>Zunächst füllen Sie Ihre persönliche Angaben aus.</p>
        {
          this.state.preferences ?
            <PlanerHeader preferences={this.state.preferences} onPreferencesChanged={this.onPreferencesChanged.bind(this)}/> :
            <p>loading...</p>
        }
        {
          this.state.categories && this.state.preferences ?
          <Checklist categories={this.state.categories} preferences={this.state.preferences}/> :
          <p>loading...</p>
        }
      </div>
    );
  }

  private onPreferencesChanged(preferences: Preference[]) : Promise<void> {
    this.setState(prevState => ({...prevState, preferences: preferences}));
    return api.postPreferences(preferences);
  }
}
