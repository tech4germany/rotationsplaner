import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IconButton} from 'office-ui-fabric-react/lib/Button';

const texts = [
  {primary: 'Lebensbedingungsbericht', secondary: 'Wissenswertes zu Pretoria', onClick: () => {}},
  {primary: 'Auslandsvertretung', secondary: 'Deutsche Vertretung in Pretoria', onClick: () => {}},
  {primary: 'Willkommensmappe', secondary: 'Ankommen in Pretoria', onClick: () => {}}
];

export default class InfoSection extends React.Component < {}, {} > {

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.infoTileSection}>
        {texts.map(t => this._renderTile(t.primary, t.secondary, t.onClick))}
      </div>
    )
  }

  private _renderTile(text, secondaryText, onClick): React.ReactElement<{}> {
    return (
      <div className={styles.infoTile} onClick={onClick}>
        <div className={styles.textContainer}>
          <span className={styles.primaryText}>{text}</span>
          <span className={styles.secondaryText}>{secondaryText}</span>
        </div>
        <IconButton iconProps={{iconName: 'OpenFile'}}/>
      </div>
    )
  }
}
