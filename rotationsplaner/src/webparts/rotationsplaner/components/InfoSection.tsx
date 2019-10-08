import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IconButton} from 'office-ui-fabric-react/lib/Button';

export interface IInfoSectionProps {
  infoData: any[];
}
export interface InfoSectionState {
  infoData: any[];
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
    return (
      <div className={styles.infoTileSection}>
        {this.state.infoData.map(tile => this._renderTile(tile))}
      </div>
    );
  }

  private _renderTile(tileData): React.ReactElement<{}> {
    return (
      <div className={styles.infoTile} onClick={() => this._onClick(tileData.link)}>
        <div className={styles.textContainer}>
          <span className={styles.primaryText}>{tileData.primaryText}</span>
          <span className={styles.secondaryText}>{tileData.secondaryText}</span>
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
