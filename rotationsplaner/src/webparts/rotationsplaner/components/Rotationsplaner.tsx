import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { IRotationsplanerProps } from './IRotationsplanerProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Rotationsplaner extends React.Component < IRotationsplanerProps, {} > {
  public render(): React.ReactElement<IRotationsplanerProps> {
    return(
      <div className = { styles.rotationsplaner } >
  <div className={styles.container}>
    <div className={styles.row}>
      <div className={styles.column}>
        <span className={styles.title}>Hallo {escape(this.props.name)}!</span>
        <p className={styles.subTitle}>Für eine personalisierte Checkliste benötigen wir ein paar Informationen.</p>
        <p className={styles.description}>{escape(this.props.description)}</p>
        <a href='https://aka.ms/spfx' className={styles.button}>
          <span className={styles.label}>Learn more</span>
        </a>
      </div>
    </div>
  </div>
      </div >
    );
  }
}
