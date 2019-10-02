import {Post} from "../classes/Checklist";
import {default as AutoComplete} from "./AutoComplete";
import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import {ITag} from "office-ui-fabric-react/lib/Pickers";

export interface IPostsAutoCompleteProps {
  allPosts: Post[];
  userPosts: Array<(Post | undefined)>;
  onChangePosts: (selectedPosts: Array<(Post | undefined)>) => void;
}

export interface IPostsAutoCompleteState {
  selectedPosts: Post[];
}

export default class PostsAutoComplete extends React.Component<IPostsAutoCompleteProps, IPostsAutoCompleteState> {

  constructor(props) {
    super(props);
    this.state = {selectedPosts: props.userPosts};
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
    const postTags: ITag[] = this.props.allPosts.map(this.makeTag);
    const selectedPost = this.state.selectedPosts[postIndex];
    const selectedTag = selectedPost ? this.makeTag(selectedPost, 0) : undefined;
    return <AutoComplete
      suggestions={postTags}
      pickerSuggestionProps={{
        suggestionsHeaderText: 'Dienstorte',
        noResultsFoundText: 'Kein Ort gefunden'
      }}
      initialSelection={selectedTag}
      onChange={this.onPostChange.bind(this, postIndex)}
    />;
  }

  private makeTag(post: Post, index: number): ITag {
    return {key: index.toString(), name: post.title};
  }

  private onPostChange(postIndex: number, item?: ITag): void {
    const selectedPosts = this.state.selectedPosts;
    if (item) {
      const arrayIndex = Number(item.key);
      const post = this.props.allPosts[arrayIndex];
      selectedPosts[postIndex] = post;
    } else {
      selectedPosts[postIndex] = undefined;
    }
    this.setState(prevState => ({...prevState, selectedPosts}));
    this.props.onChangePosts(selectedPosts);
  }
}
