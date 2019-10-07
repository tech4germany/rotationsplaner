import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IRotationsplanerProps} from './IRotationsplanerProps';
import {Checklist} from './Checklist';
import {default as PlanerHeader} from './PlanerHeader';
import api from '../api/api';
import {Category, Preference, UserPost} from '../classes/Checklist';
import InfoSection from './InfoSection';
import {MessageBar, MessageBarType} from 'office-ui-fabric-react/lib/MessageBar';

export interface RotationsplanerState {
  categories: Category[];
  preferences: Preference[];
  infoData: any[];
  message: any;
  userPosts: Array<UserPost | undefined>;
}

export default class Rotationsplaner extends React.Component < IRotationsplanerProps, RotationsplanerState > {
  public state: RotationsplanerState = {
    categories: undefined,
    preferences: undefined,
    infoData: undefined,
    userPosts: [undefined, undefined],
    message: {
      // type: MessageBarType.severeWarning,
      // text: 'This is a test warning...'
    }
  };

  public componentDidMount(): void {
    this.fetchCategories().catch(this.handleError.bind(this)); // don't wait
    this.fetchPreferences().catch(this.handleError.bind(this)); // don't wait
    this.fetchInfoData().catch(this.handleError.bind(this)); // don't wait
    this.fetchPosts().catch(this.handleError.bind(this)); // don't wait
  }

  private async fetchCategories(): Promise<void> {
    const categories: Category[] = await api.fetchCategories();
    this.setState(prevState => ({...prevState, categories: categories}));
  }

  private async fetchPreferences(): Promise<void> {
    const preferences: Preference[] = await api.fetchPreferences();
    this.setState(prevState => ({...prevState, preferences: preferences}));
  }

  private async fetchInfoData() : Promise<void> {
    const infoData = await api.fetchInfoData();
    this.setState(prevState => ({...prevState, infoData: infoData}));
  }

  private async fetchPosts() : Promise<void> {
    const userPosts = await api.fetchUserPosts();
    this.setState(prevState => ({...prevState, userPosts}));
  }

  public render(): React.ReactElement<IRotationsplanerProps> {
    return(
      <div className={styles.rotationsplaner}>
        {this.renderMessageBar()}
        <h1>Willkommen {this.props.userName}</h1>
        <p>Wir helfen Ihnen dabei, alle relevanten Informationen, Formulare, und To-Dos zu finden. Außerdem unterstützen wir Sie dabei, Ihre individuelle Checkliste anzulegen.</p>
        <p>Zunächst füllen Sie Ihre persönliche Angaben aus.</p>
        {
          (this.state.preferences && this.state.userPosts) ?
            <PlanerHeader
              preferences={this.state.preferences}
              selectedPosts={this.state.userPosts}
              onPreferencesChanged={this.onPreferencesChanged.bind(this)}/> :
            <p>loading...</p>
        }
        <InfoSection infoData={this.state.infoData}/>
        {
          this.state.categories && this.state.preferences ?
          <Checklist categories={this.state.categories} preferences={this.state.preferences}/> :
          <p>loading...</p>
        }
      </div>
    );
  }

  private renderMessageBar(): React.ReactElement<{}> {
    return (
      <MessageBar className={this.state.message.text ? styles.contentVisible : styles.contentHidden}
                  messageBarType={this.state.message.type}
                  onDismiss={() => this.setState(prevState => ({...prevState, message: {}}))}>
        {this.state.message.text}
      </MessageBar>);
  }

  private async onPreferencesChanged(preferences: Preference[], posts: UserPost[]): Promise<void> {
    console.log('saving preferences:', preferences, posts);
    this.setState(prevState => ({...prevState, preferences: preferences}));
    await api.postPreferences(preferences);
    await api.postUserPosts(posts);
    this.displaySuccessMessage();
  }

  private displaySuccessMessage(): void {
    this.setState(prevState => ({
      ...prevState,
      message: {
        type: MessageBarType.success,
        text: 'Ihre Angaben wurden erfolgreich gespeichert.'
      }
    }));
  }

  private handleError(error): void {
    console.error(error);
    this.setState(prevState => ({
      ...prevState,
      message: {
        type: MessageBarType.error,
        text: error
      }
    }));
  }
}
