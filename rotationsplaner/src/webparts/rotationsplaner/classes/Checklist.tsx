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
  public readonly showOnlyFor?: string; // Preference.name
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
  public readonly key: string;  // depends on description id

  public hasPOC(): boolean {
    return this.description && !!this.description.pointOfContact;
  }

  public getPOC(): string {
    return (this.description && this.description.pointOfContact) ?
            this.description.pointOfContact.name : '';
  }

  public hasLinks(): boolean {
    return this.description && !!this.description.links;
  }

  public getLinks(): LinkedItem[] {
    return this.description ? this.description.links : [];
  }
}

export class Category {
  public readonly name: string;
  public tasks: Task[];
}

export enum PreferenceCategory {
  dependents,
  items
}

export class Preference {
  public constructor(object: any) {
    this.name = object.Title;
    this.checked = undefined;
    this.description = object.Beschreibung;
    switch (object.Kategorie) {
      case 'Familie':
        this.category = PreferenceCategory.dependents;
        break;
      case 'Gegenstände':
        this.category = PreferenceCategory.items;
        break;
      default:
        throw Error(`unknown category ${object.Kategorie}`);
    }
  }

  public name: string;
  public description: string;
  public checked: boolean;
  public category: PreferenceCategory;
}
