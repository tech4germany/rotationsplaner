import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IRotationsplanerProps} from './IRotationsplanerProps';
import {Checklist} from "./Checklist";
import {default as PlanerHeader} from "./PlanerHeader";
import api from "../api/api";
import {Category, Preference} from "../classes/Checklist";

export interface RotationsplanerState {
  categories: Category[];
  preferences: Preference[];
}


export default class Rotationsplaner extends React.Component < IRotationsplanerProps, RotationsplanerState > {
  public state: RotationsplanerState = {
    categories: null,
    preferences: null
  }

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
        <div className={styles.container}>
          <div className={styles.row}>
            {
              this.state.preferences ?
                <PlanerHeader preferences={this.state.preferences} onPreferencesChanged={this.onPreferencesChanged.bind(this)}/> :
                <p>loading...</p>
            }
          </div>
          <div className={styles.row}>
            {
              this.state.categories && this.state.preferences ?
              <Checklist categories={this.state.categories} preferences={this.state.preferences}/> :
              <p>loading...</p>
            }
          </div>
        </div>
      </div>
    );
  }

  private onPreferencesChanged(preferences: Preference[]) : Promise<void> {
    this.setState(prevState => ({...prevState, preferences: preferences}));
    return api.postPreferences(preferences);
  }
}
