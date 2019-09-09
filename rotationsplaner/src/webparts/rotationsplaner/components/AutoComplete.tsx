import * as React from "react";
import styles from "./Rotationsplaner.module.scss";

import * as Autocomplete from 'react-autocomplete';

export interface IAutoCompleteProps {
  suggestions: string[];
}

export interface AutoCompleteState {
  value: string;
}

export default class AutoComplete extends React.Component < IAutoCompleteProps, AutoCompleteState > {
  public state: AutoCompleteState = {value: ''};

  public render(): React.ReactElement<{}> {
    return(
      <div className={styles.autoComplete}>
        <Autocomplete
          getItemValue={(item) => item.label}
          items={this.props.suggestions.map(c => ({label: c}))}
          renderItem={this._renderItem}
          renderMenu={this._renderMenu}
          value={this.state.value}
          onChange={this._onChange.bind(this)}
          onSelect={this._setState.bind(this)}
        />
      </div>
    );
  }

  private _renderMenu(children) {
    return (
      <div className={`menu ${styles.autoCompleteMenu}`}>
        {children}
      </div>
    )
  }

  private _renderItem(item, isHighlighted) {
    return (
      <div className={`${styles.autoCompleteItem} ${isHighlighted ? styles.highlighted: ''}`}>
        {item.label}
      </div>
    )
  }

  private _onChange(e, newValue) {
    this._setState(newValue);

    // todo: filter suggestions
    // todo: validate
  }

  private _setState(newValue) {
    this.setState((current) => ({...current, value: newValue}));
  }
}
