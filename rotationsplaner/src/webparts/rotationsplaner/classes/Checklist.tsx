class LinkedItem {
  public readonly description: string;
  public readonly uri: string;
}

class Contact {
}

class TaskDescription {
  public readonly id: string;
  public readonly name: string;
  public readonly detailText?: string;
  public readonly links?: LinkedItem[];
  public readonly pointOfContact?: Contact;
  public readonly showOnlyFor?: Preference;
  public readonly isCustom: Boolean;
}

class Task {
  public readonly description: TaskDescription;
  public checked: boolean = false;
  public dueBy?: Date;
}

class Category {
  public readonly name: string;
  public readonly tasks: Task[];
}

class Preference {
  name: string;
  description: string;
}
