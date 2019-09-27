import {ItemAddResult, ItemUpdateResult} from "@pnp/sp";

export class LinkedItem {
  public readonly description: string;
  public readonly uri: string;
}

export class Contact {
  public readonly name: string;
}

export class CustomTask {
  public readonly id?: number;
  public readonly name: string;
  public readonly detailText?: string;
  public checked: boolean;
  public readonly category: string;

  public serialize(): object {
    return {
      Id: this.id,
      Title: this.name,
      Beschreibung: this.detailText,
      Category: this.category,
      Checked: this.checked
    };
  }

  constructor(result: ItemAddResult | ItemUpdateResult) {
    const data = result.data;
    this.id = data.Id;
    this.name = data.Title;
    this.detailText = data.Beschreibung;
    this.category = data.Category;
    this.checked = data.Checked;
  }
}


export class Task {
  constructor(description, checked, isArchived, dueBy) {
    this.description = description;
    this.checked = checked;
    this.isArchived = isArchived;
    this.dueBy = dueBy;
    this.key = description.id;
  }

  public readonly id: string; // references Task Id, not TaskProgress Id
  public readonly name: string; // TODO rename to title
  public readonly detailText?: string;
  public readonly links?: LinkedItem[];
  public readonly pointOfContact?: Contact;
  public readonly showOnlyFor?: string; // Preference.name

  public checked: boolean = false;
  public isArchived: boolean = false;
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
    return !!this.links;
  }

  public getLinks(): LinkedItem[] {
    return this.links;
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
