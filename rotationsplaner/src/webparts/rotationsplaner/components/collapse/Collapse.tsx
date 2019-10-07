import * as React from 'react';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from './ExpansionButton';

export interface ICollapseProps {
  title: string;
  headerSecondary?: JSX.Element;
  defaultExpanded?: boolean;
  expanded?: boolean;
  className?: string;
}

export interface ICollapseState {
  expanded: boolean;
}

export default class Collapse extends React.Component < ICollapseProps, ICollapseState > {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.expanded || this.props.defaultExpanded || false
    };
  }

  public componentWillReceiveProps({expanded}) {
    this.setState(prevState => ({
      ...prevState,
      expanded: expanded === undefined ? prevState.expanded : expanded
    }));
  }

  public render(): React.ReactElement<ICollapseProps> {
    return(
      <section className={`${styles.collapse} ${this.props.className}`}>
        <div className={styles.header} onClick={e => this.toggleExpanded()} role='button'>
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

  private toggleExpanded(): void {
    this.setState((current) => ({...current, expanded: !current.expanded}));
  }

  private renderContent(): React.ReactElement<{}> {
    return <div className={`${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
      {this.props.children}
    </div>;
  }
}
