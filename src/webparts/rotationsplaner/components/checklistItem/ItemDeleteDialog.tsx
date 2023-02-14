import * as React from 'react';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {AnyTask, CustomTask} from "../../classes/Checklist";
import {Dialog, DialogFooter, DialogType} from 'office-ui-fabric-react/lib/Dialog';


export interface IItemDeleteDialogProps {
  task: AnyTask;
  isVisible: boolean;
  onConfirm: () => void;
  onAbort: () => void;
}

export default class ItemDeleteDialog extends React.Component <IItemDeleteDialogProps, {}> {

  public render(): React.ReactElement<IItemDeleteDialogProps> {
    if (!(this.props.task instanceof CustomTask)) {
      return null;
    }
    return <Dialog
      isOpen={this.props.isVisible}
      type={DialogType.normal}
      isBlocking={true}
      title='Aufgabe löschen?'
      subText={`"${this.props.task.title}" wird gelöscht.`}
    >
      <DialogFooter>
        <PrimaryButton onClick={() => this.props.onAbort()} text="Abbrechen" />
        <DefaultButton onClick={() => this.props.onConfirm()} text="Löschen" />
      </DialogFooter>
    </Dialog>;
  }

}
