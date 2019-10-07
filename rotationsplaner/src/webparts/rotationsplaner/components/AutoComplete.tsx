import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IBasePickerSuggestionsProps, ITag, TagPicker} from 'office-ui-fabric-react/lib/Pickers';

export interface IAutoCompleteProps {
  suggestions: ITag[];
  pickerSuggestionProps: IBasePickerSuggestionsProps;
  onChange: (item?: ITag) => void;
  initialSelection?: ITag;
  disabled: boolean;
}

export interface IAutoCompleteState {
  selection: ITag;
}

export default class AutoComplete extends React.Component < IAutoCompleteProps, IAutoCompleteState > {
  public state: IAutoCompleteState = {
    selection: this.props.initialSelection
  };

  public render(): React.ReactElement<IAutoCompleteProps> {
    const selectedItem = this.state.selection ? [this.state.selection] : [];
    return(
      <div className={styles.autoComplete}>
        <TagPicker
          onResolveSuggestions={this._onFilterChanged.bind(this)}
          onChange={this._onChange.bind(this)}
          pickerSuggestionsProps={this.props.pickerSuggestionProps}
          // This is a workaround to only show a single selection.
          // The key is changed whenever a new selection is made.
          // Changing it causes the TagPicker to re-render with only the defaultSelectedItem being selected.
          key={(this.state.selection && this.state.selection.key) || 'picker'}
          defaultSelectedItems={selectedItem}
          disabled={this.props.disabled}
        />
      </div>
    );
  }

  private _onFilterChanged(filterText: string, tagList: ITag[]): ITag[] {
    if (!filterText) {
      return [];
    } else {
      return this.props.suggestions
        .filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
    }
  }

  private _onChange(items) {
    // select the latest entry, if any
    const selection: ITag | undefined = items.length > 0 ? items[items.length - 1] : undefined;
    this.setState(prevState => ({...prevState, selection: selection}));
    this.props.onChange(selection);
  }
}
