import * as React from "react";
import styles from "./Rotationsplaner.module.scss";
import { IconButton } from 'office-ui-fabric-react/lib/Button';


export interface IExpansionButtonProps {
  className?: string;
  expanded: boolean;
  onClick: (event: object) => void;
}

export default class ExpansionButton extends React.Component<IExpansionButtonProps, {}> {
  public render() {
    return <IconButton iconProps={{iconName: "ChevronRight"}}
                       title={"Abschnitt ein/ausklappen"}
                       ariaLabel={this.props.expanded ? "einklappen" : "ausklappen"}
                       onClick={this.props.onClick}
                       className={`${styles.expansionButton} ${this.props.className} ${this.props.expanded ? styles.arrowDown : styles.arrowRight}`}/>;
  }
}
