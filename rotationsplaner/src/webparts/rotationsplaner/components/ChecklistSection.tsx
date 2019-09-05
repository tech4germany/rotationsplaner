import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { IChecklistSectionProps } from './IChecklistSectionProps';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { GroupedList } from 'office-ui-fabric-react/lib/GroupedList';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

export default class ChecklistSection extends React.Component < IChecklistSectionProps, {} > {
  public state = {};

  public render(): React.ReactElement<IChecklistSectionProps> {
    return(
      <div className = { styles.checklistSection } >
        <span className={styles.title}>{this.props.title}</span>
        <GroupedList
          items = {this.props.items}
          onRenderCell = {this._onRenderCell}
        />
      </div >
    );
  }

  private _generateCheckListItems() {
    console.log(this.props.items)
    return this.props.items.map((item: Task) =>
      <Checkbox className = {styles.checklistItem} label={item.description.name} checked={item.checked}/>
    );
  }

  private _onRenderCell(nestingDepth: number, item: Task, itemIndex: number): JSX.Element {
    const calloutId = itemIndex;
    return <div>
      <Checkbox className={styles.checklistItem} label={item.description.name}/>
      <DefaultButton text='More Info'/>
    </div>;
  }

  private _onShowMenuClicked(calloutId) {
    console.log(`Button ${calloutId} has been clicked.`);
  }

  private _onCheckboxChange = (index: number, ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
    console.log(`The option ${index} has been changed to ${isChecked}.`);
  };
}
