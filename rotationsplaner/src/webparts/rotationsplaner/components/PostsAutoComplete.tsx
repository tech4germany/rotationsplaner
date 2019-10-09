import {Dienstposten, DienstpostenAuswahl} from "../classes/Checklist";
import {default as AutoComplete} from "./AutoComplete";
import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import {ITag} from "office-ui-fabric-react/lib/Pickers";
import api from "../api/api";

export interface IPostsAutoCompleteProps {
  selectedPosts: DienstpostenAuswahl;
  onChangePosts: (selectedPosts: DienstpostenAuswahl) => void;
}

export interface IPostsAutoCompleteState {
  allPosts: Dienstposten[];
  selectedPosts: DienstpostenAuswahl;
}

export default class PostsAutoComplete extends React.Component<IPostsAutoCompleteProps, IPostsAutoCompleteState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedPosts: props.selectedPosts,
      allPosts: undefined
    };
  }

  public componentWillReceiveProps(nextProps: IPostsAutoCompleteProps, nextContext: any): void {
    this.setState(prevState => ({...prevState, selectedPosts: nextProps.selectedPosts}));
  }

  public async componentDidMount(): Promise<void> {
    try {
      const allPosts = await api.fetchPosts();
      this.setState(prevState => ({...prevState, allPosts}));
    } catch (e) {
      console.error(e); // TODO
    }
  }

  public render(): React.ReactElement<IPostsAutoCompleteProps> {
    return <div>
      <div className={styles.halfColumnSm}>
        <span className={styles.question}>Von wo rotieren Sie?</span>
        {this.getAutoComplete(false, this.state.selectedPosts.origin)}
      </div>
      <div className={styles.halfColumnSm}>
        <span className={styles.question}>Wohin werden Sie rotieren?</span>
        {this.getAutoComplete(true, this.state.selectedPosts.destination)}
      </div>
    </div>;
  }

  private getAutoComplete(isDestination: boolean, preselectedPost?: Dienstposten) {
    const postTags: ITag[] = this.state.allPosts ? this.state.allPosts.map(this.makeTag) : [];
    const selectedTag = preselectedPost ? this.makeTag(preselectedPost, 0) : undefined;
    const isLoading = this.state.allPosts === undefined;
    return <AutoComplete
      suggestions={postTags}
      pickerSuggestionProps={{
        suggestionsHeaderText: isLoading ? 'Lade Dienstorte...' : 'Dienstorte',
        noResultsFoundText: isLoading ? undefined : 'Kein Ort gefunden'
      }}
      initialSelection={selectedTag}
      onChange={this.onPostChange.bind(this, isDestination)}
      disabled={false}
    />;
  }

  private makeTag(post: Dienstposten, index: number): ITag {
    return {key: index.toString(), name: post.title};
  }

  private onPostChange(isDestination: boolean, item?: ITag): void {
    if (item) {
      const post = this.state.allPosts[Number(item.key)];
      this.savePostChange(isDestination, post);
    } else {
     this.savePostChange(isDestination);
    }

  }

  private savePostChange(isDestination: boolean, post?: Dienstposten) {
    const selectedPosts = this.state.selectedPosts;
    if (isDestination) {
      selectedPosts.destination = post;
    } else {
      selectedPosts.origin = post;
    }
    this.setState(prevState => ({...prevState, selectedPosts}));
    this.props.onChangePosts(selectedPosts);
  }
}
