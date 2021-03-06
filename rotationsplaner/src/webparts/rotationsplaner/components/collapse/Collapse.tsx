import * as React from 'react';
import styles from '../Rotationsplaner.module.scss';

import ExpansionButton from './ExpansionButton';

export interface ICollapseProps {
  title: string;
  headerSecondary?: JSX.Element;
  defaultExpanded?: boolean;
  expanded?: boolean;
  className?: string;
  onCollapse?: () => void;
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
      <div className={`${styles.collapse} ${this.props.className || ''}`}>
        <div className={styles.header} onClick={e => this.toggleExpanded()} role='button'>
          <ExpansionButton
            expanded={this.state.expanded}
          />
          <span className={styles.title}>{this.props.title}</span>
          {this.props.headerSecondary}
        </div>
        {this.renderContent()}
      </div>
    );
  }

  private toggleExpanded(): void {
    this.setState((current) => ({...current, expanded: !current.expanded}));

    if (this.state.expanded === false && this.props.onCollapse) {
      this.props.onCollapse();
    }
  }

  private renderContent(): React.ReactElement<{}> {
    return <div className={`${this.state.expanded ? styles.contentVisible : styles.contentHidden}`}>
      {this.props.children}
    </div>;
  }
}
