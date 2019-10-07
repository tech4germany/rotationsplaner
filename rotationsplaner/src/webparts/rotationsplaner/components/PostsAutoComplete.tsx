import {Post, UserPost} from "../classes/Checklist";
import {default as AutoComplete} from "./AutoComplete";
import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import {ITag} from "office-ui-fabric-react/lib/Pickers";
import api from "../api/api";

export interface IPostsAutoCompleteProps {
  selectedPosts: Array<UserPost | undefined>;
  onChangePosts: (selectedPosts: Array<(UserPost | undefined)>) => void;
}

export interface IPostsAutoCompleteState {
  allPosts: Post[];
  selectedPosts: UserPost[];
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
        {this.getAutoComplete(0)}
      </div>
      <div className={styles.halfColumnSm}>
        <span className={styles.question}>Wohin werden Sie rotieren?</span>
        {this.getAutoComplete(1)}
      </div>
    </div>;
  }

  private getAutoComplete(postIndex: number) {
    const postTags: ITag[] = this.state.allPosts ? this.state.allPosts.map(this.makeTag) : [];
    const selectedPost = this.state.selectedPosts[postIndex];
    const selectedTag = selectedPost && selectedPost.post ? this.makeTag(selectedPost.post, 0) : undefined;
    const isLoading = this.state.allPosts === undefined;
    return <AutoComplete
      suggestions={postTags}
      pickerSuggestionProps={{
        suggestionsHeaderText: isLoading ? 'Lade Dienstorte...' : 'Dienstorte',
        noResultsFoundText: isLoading ? undefined : 'Kein Ort gefunden'
      }}
      initialSelection={selectedTag}
      onChange={this.onPostChange.bind(this, postIndex)}
      disabled={false}
    />;
  }

  private makeTag(post: Post, index: number): ITag {
    return {key: index.toString(), name: post.title};
  }

  private onPostChange(postIndex: number, item?: ITag): void {
    const selectedPosts = this.state.selectedPosts;
    if (item) {
      const arrayIndex = Number(item.key);
      const post = this.state.allPosts[arrayIndex];
      const isDestination = postIndex === 1;
      selectedPosts[postIndex] = new UserPost(isDestination, post);
    } else {
      selectedPosts[postIndex] = undefined;
    }
    this.setState(prevState => ({...prevState, selectedPosts}));
    this.props.onChangePosts(selectedPosts);
  }
}
