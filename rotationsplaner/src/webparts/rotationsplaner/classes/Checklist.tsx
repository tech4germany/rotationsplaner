export class LinkedItem {
  public readonly description: string;
  public readonly uri: string;
}

export class Contact {
  public readonly name: string;
  public readonly link: string;

  public static deserialize(data: any): Contact {
    return {name: data.AnzeigeText, link: data.Link};
  }
}

export class CustomTask {
  public readonly id?: number;
  public name: string;
  public detailText?: string;
  public checked: boolean;
  public readonly category: string;
  public readonly showOnlyFor?: string = undefined;
  public isArchived: boolean = false;

  public serialize(): object {
    return {
      Id: this.id,
      Title: this.name,
      Beschreibung: this.detailText,
      Category: this.category,
      Checked: this.checked,
      Archived: this.isArchived,
    };
  }

  constructor(name: string, category: string, isArchived: boolean, checked: boolean,
              id?: number, detailText?: string, showOnlyFor?: string) {
    this.id = id;
    this.name = name;
    this.detailText = detailText;
    this.category = category;
    this.checked = checked;
    this.isArchived = isArchived;
    this.showOnlyFor = showOnlyFor;
  }

  public static fromDatabase(data: any) {
    return new CustomTask(data.Title, data.Category, data.Archived, data.Checked, data.Id, data.Beschreibung);
  }

  public static emptyTask(category: string): CustomTask {
    return new CustomTask('', category, false, false);
  }
}


export class Task {
  constructor(
    id: number, name: string, checked: boolean, isArchived: boolean, category: string,
    detailText?: string, links?: LinkedItem[], pointOfContact?: Contact, showOnlyFor?: string
  ) {
    // required properties
    this.id = id;
    this.name = name;
    this.checked = checked;
    this.isArchived = isArchived;
    this.category = category;

    // optional properties
    this.detailText = detailText;
    this.links = links;
    this._pointOfContact = pointOfContact;
    this.showOnlyFor = showOnlyFor;
  }

  public readonly id: number; // references Task Id, not TaskProgress Id
  public readonly name: string; // TODO rename to title
  public readonly category: string;
  public readonly detailText?: string;
  public readonly links?: LinkedItem[];
  private readonly _pointOfContact?: Contact;
  public readonly showOnlyFor?: string; // Preference.name

  public checked: boolean = false;
  public isArchived: boolean = false;

  public get hasPointOfContact(): boolean {
    return !!this._pointOfContact;
  }

  public get pointOfContact(): string {
    return (this._pointOfContact)
      ? this._pointOfContact.name
      : '';
  }

  public get hasLinks(): boolean {
    return !!this.links;
  }

  /**
   * This creates a new Task object without the TaskProgress properties.
   * These need to be added later
   * @param data Serialized item from the Task list
   */
  public static deserializeTask(data: any): Task {
    let contact: Contact;
    if (data.Kontakt) contact = Contact.deserialize(data.Kontakt);

    return new Task(
      data.ID,
      data.Title,
      undefined,
      undefined,
      data.Kategorie,
      data.Beschreibung,
      [/*task.Links*/],
      contact,
      data.Tags
    );
    // TODO remaining fields
  };

}

export class Category {
  public readonly name: string;
  public tasks: (Task | CustomTask)[];
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
