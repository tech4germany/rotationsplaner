import * as React from 'react';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from './ExpansionButton';

export interface ICollapseProps {
  title: string;
  headerSecondary?: JSX.Element;
}

export interface ICollapseState {
  expanded: boolean;
}


export default class Collapse extends React.Component < ICollapseProps, ICollapseState > {
  public state: ICollapseState = {expanded: false};

  public render(): React.ReactElement<ICollapseProps> {
    return(
      <section className={styles.collapse}>
        <div className={styles.header} onClick={e => this.toggleExpanded()}>
          <ExpansionButton
            expanded={this.state.expanded}
          />
          <span className={styles.title}>{this.props.title}</span>
          {this.props.headerSecondary}
        </div>
        {this.renderContent()}
      </section>
    );
  }

  private toggleExpanded() {
    this.setState((current) => ({...current, expanded: !current.expanded}));
  }

  private renderContent() {
    return <div className={`${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
      {this.props.children}
    </div>;
  }
}
