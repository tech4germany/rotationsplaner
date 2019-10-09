import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IconButton} from 'office-ui-fabric-react/lib/Button';
import {DienstorteLink} from "../classes/Checklist";

export interface IInfoSectionProps {
  infoData: DienstorteLink[];
}
export interface InfoSectionState {
  infoData: DienstorteLink[];
}

export default class InfoSection extends React.Component < IInfoSectionProps, InfoSectionState > {
  constructor(props: {}) {
    super(props);

    this.state = {
      infoData: this.props.infoData || [],
    };
  }

  public componentWillReceiveProps({infoData}) {
    this.setState(prevState => ({...prevState, infoData}));
  }

  public render(): React.ReactElement<{}> {
    return this.state.infoData !== undefined ? (
      <div className={styles.infoTileSection}>
        {this.state.infoData.map(tile => this._renderTile(tile))}
      </div>
    ) : null;
  }

  private _renderTile(tileData): React.ReactElement<{}> {
    return (
      <div className={styles.infoTile} onClick={() => this._onClick(tileData.url)} key={tileData.id}>
        <div className={styles.textContainer}>
          <span className={styles.primaryText}>{tileData.title}</span>
          <span className={styles.secondaryText}>Wissenswertes zu {tileData.location}</span>
        </div>
        <IconButton iconProps={{iconName: 'OpenFile'}}/>
      </div>
    );
  }

  private _onClick(link) {
    const win = window.open(link, '_blank');
    win.focus();
  }
}
