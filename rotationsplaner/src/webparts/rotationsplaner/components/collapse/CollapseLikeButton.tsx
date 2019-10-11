import * as React from 'react';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from './ExpansionButton';

export interface ICollapseLikeButtonProps {
  title: string;
  onClick: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
}


export default class CollapseLikeButton extends React.Component < ICollapseLikeButtonProps, {} > {

  public render(): React.ReactElement<ICollapseLikeButtonProps> {
    return(
      <section className={`${styles.collapse} ${styles.transparentItem}`}>
        <div className={styles.header} onClick={this.props.onClick} role='button'>
          <ExpansionButton
            expanded={false}
            icon='Add'
          />
          <span className={styles.title}>{this.props.title}</span>
        </div>
      </section>
    );
  }
}
