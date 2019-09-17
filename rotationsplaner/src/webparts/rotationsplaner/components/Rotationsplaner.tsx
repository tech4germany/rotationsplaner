import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import {IRotationsplanerProps} from './IRotationsplanerProps';
import {Checklist} from "./Checklist";
import {default as PlanerHeader} from "./PlanerHeader";


export default class Rotationsplaner extends React.Component < IRotationsplanerProps, {} > {
  public render(): React.ReactElement<IRotationsplanerProps> {
    return(
      <div className={styles.rotationsplaner}>
        <div className={styles.container}>
          <div className={styles.row}>
            <PlanerHeader/>
          </div>
          <div className={styles.row}>
            <Checklist/>
          </div>
        </div>
      </div>
    );
  }
}
