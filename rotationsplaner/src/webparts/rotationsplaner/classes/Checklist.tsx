export class LinkedItem {
  public readonly description: string;
  public readonly uri: string;
}

export class Contact {
  public readonly name: string;
}

export class TaskDescription {
  public readonly id: string;
  public readonly name: string;
  public readonly detailText?: string;
  public readonly links?: LinkedItem[];
  public readonly pointOfContact?: Contact;
  public readonly showOnlyFor?: Preference;
  public readonly isCustom: Boolean;
}

export class Task {
  constructor(description, checked, dueBy) {
    this.description = description;
    this.checked = checked;
    this.dueBy = dueBy;
    this.key = description.id;
  }

  public readonly description: TaskDescription;
  public checked: boolean = false;
  public dueBy?: Date;
  public readonly key: string;

  public hasPOC(): boolean {
    return this.description && !!this.description.pointOfContact;
  }

  public hasLinks(): boolean {
    return this.description && !!this.description.links;
  }
}

export class Category {
  public readonly name: string;
  public tasks: Task[];
}

export class Preference {
  name: string;
  description: string;
}
