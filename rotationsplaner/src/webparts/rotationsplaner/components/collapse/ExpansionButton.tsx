import * as React from 'react';
import styles from '../Rotationsplaner.module.scss';
import {IconButton} from 'office-ui-fabric-react/lib/Button';

export interface IExpansionButtonProps {
  className?: string;
  icon?: string;
  expanded: boolean;
  onClick?: (event: object) => void;
}

export default class ExpansionButton extends React.Component<IExpansionButtonProps, {}> {
  public render(): React.ReactElement<{}> {
    const iconName: string = this.props.icon || 'ChevronRight';
    return <IconButton iconProps={{iconName: iconName}}
                       title={'Abschnitt ein/ausklappen'}
                       ariaLabel={this.props.expanded ? 'einklappen' : 'ausklappen'}
                       onClick={this.props.onClick}
                       className={`${styles.headerButton} ${this.getStyleClasses()}`}/>;
  }

  public getStyleClasses(): string {
    // applies the rotate class for the standard icon (>),
    // otherwise the highlight class since rotation makes no sense for other icons
    const expandedClass: string = this.props.icon ? styles.expandIconHighlighted : styles.expandIconRotate;
    return `${this.props.className || ''} ${this.props.expanded ? expandedClass : styles.expandIcon}`;
  }
}
