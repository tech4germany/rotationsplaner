export type LinkedItemContent = string; // HTML string

export class Contact {
  public readonly name: string;
  public readonly id: number;

  // other fields caused problems in our test instance
  public static queryFields: string[] = ['Kontakt/Name', 'Kontakt/Id']; // later add 'Kontakt/EMail', 'Kontakt/WorkPhone';

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  public static deserialize(data: any): Contact {
    // more fields described in
    // https://vijayasankarn.wordpress.com/2017/12/22/sharepoint-person-or-group-field-properties/
    return new Contact(data.Name, data.Id);
  }

  public get url(): string {
    return `/_layouts/15/userdisp.aspx?ID=${this.id}`;
  }
}

export class CustomTask {
  public readonly id?: number;
  public title: string;
  public detailText?: string;
  public checked: boolean;
  public readonly category: string;
  public readonly showOnlyFor?: string = undefined;
  public hasDetails: boolean = true;
  public isArchived: boolean = false;

  constructor(name: string, category: string, isArchived: boolean, checked: boolean,
              id?: number, detailText?: string, showOnlyFor?: string) {
    this.id = id;
    this.title = name;
    this.detailText = detailText;
    this.category = category;
    this.checked = checked;
    this.showOnlyFor = showOnlyFor;
  }

  public static fromDatabase(data: any): CustomTask {
    return new CustomTask(data.Title, data.Category, data.Archived, data.Checked, data.Id, data.Beschreibung);
  }

  public static emptyTask(category: string): CustomTask {
    return new CustomTask('', category, false, false);
  }

  public serialize(): object {
    return {
      Id: this.id,
      Title: this.title,
      Beschreibung: this.detailText,
      Category: this.category,
      Checked: this.checked,
    };
  }

  public shouldShowForPreferences(preferences: string[]): boolean {
    return true;
  }

  public get isEmpty() {
    return this.title.trim() == '' && this.detailText == undefined;
  }
}

export type AnyTask = (Task | CustomTask);

export class Task {
  constructor(
    id: number, title: string, checked: boolean, isArchived: boolean, category: string,
    detailText?: string, ordinance?: LinkedItemContent, form?: LinkedItemContent,
    pointsOfContact?: Contact[], showOnlyFor?: string, showOnlyForLocation?: string
  ) {
    // required properties
    this.id = id;
    this.title = title;
    this.checked = checked;
    this.isArchived = isArchived;
    this.category = category;

    // optional properties
    this.detailText = detailText;
    this.ordinance = ordinance;
    this.form = form;
    this.pointsOfContact = pointsOfContact;
    this.showOnlyFor = showOnlyFor;
    this.showOnlyForLocation = showOnlyForLocation;
  }

  public readonly id: number; // references Task Id, not TaskProgress Id
  public readonly title: string;
  public readonly category: string;
  public readonly detailText?: string;
  public readonly ordinance?: LinkedItemContent;  // Gesetz
  public readonly form?: LinkedItemContent;   // Formular
  public readonly pointsOfContact?: Contact[];
  public readonly showOnlyFor?: string; // Preference.title referenced in Task.Bedingung
  public readonly showOnlyForLocation?: string;

  public checked: boolean = false;
  public isArchived: boolean = false;

  public get hasPointOfContact(): boolean {
    return !!this.pointsOfContact && this.pointsOfContact.length > 0;
  }

  public get hasDetails(): boolean {
    return !!this.detailText || !!this.ordinance || !!this.form || this.hasPointOfContact;
  }

  /**
   * This creates a new Task object without the TaskProgress properties.
   * These need to be added later
   * @param data Serialized item from the Task list
   */
  public static deserializeTask(data: any): Task {
    let contacts: Contact[];
    if (data.Kontakt) {
      contacts = data.Kontakt.map(Contact.deserialize);
    }

    return new Task(
      data.ID,
      data.Title,
      undefined,
      undefined,
      data.Kategorie,
      data.Beschreibung,
      data.Gesetz,
      data.Formular,
      contacts,
      data.Bedingung ? data.Bedingung.Title : undefined,
      data.Dienstort ? data.Dienstort.Title : undefined
    );
    // TODO remaining fields
  }

  public shouldShowForPreferences(preferences: string[]): boolean {
    if (!this.showOnlyFor && !this.showOnlyForLocation) {
      return true;
    }
    return preferences.some(preference =>
      this.showOnlyFor == preference || this.showOnlyForLocation == preference
    );
  }
}

export class Category {
  public readonly name: string;
  public tasks: AnyTask[];

  public tasksForPreferences(preferences: string[]): AnyTask[] {
    return this.tasks.filter(t => t.shouldShowForPreferences(preferences));
  }

  constructor(name: string, tasks: AnyTask[]) {
    this.name = name;
    this.tasks = tasks;
  }
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
      case 'dienstortspezifisch':
        break;
      default:
        console.warn(`unknown category ${object.Kategorie}`);
    }
  }

  public name: string;
  public description: string;
  public checked: boolean;
  public category: PreferenceCategory;

  public static serializeAsUserPreference(p: Preference): any {
    return {
      Title: p.name,
      Checked: p.checked
    };
  }
}

export class DienstorteLink {
  public id: number;
  public title: string;
  public location: string;
  public url: string;
  public dienstortId: number;

  public static deserialize(data: any): DienstorteLink {
    return {
      id: data.Id,
      title: data.URL.Description,
      url: data.URL.Url,
      dienstortId: data.Dienstorte.Id,
      location: data.Dienstorte.Location
    };
  }
}

export class Dienstposten {
  public id: number;
  public title: string;
  public tags: string[];

  public static deserialize(data: any): Dienstposten {
    return {
      id: data.Id,
      title: data.Title,
      tags: (data.Bedingungen || []).map(t => t.Title)
    };
  }
}

export class UserDienstorte {
  public origin?: Dienstposten;
  public destination?: Dienstposten;

  constructor(origin?: Dienstposten, destination?: Dienstposten) {
    this.origin = origin;
    this.destination = destination;
  }

  public static deserialize(data: any): UserDienstorte {
    const origin = data.Origin ? Dienstposten.deserialize(data.Origin) : null;
    const destination = data.Destination ? Dienstposten.deserialize(data.Destination) : null;
    return new UserDienstorte(origin, destination);
  }

  public serialize(): any {
    return {
      OriginId: this.origin ? this.origin.id : null,
      DestinationId: this.destination ? this.destination.id : null
    };
  }

  // public get tags(): string[] {
  //   if(!this.post) return [];
  //   return this.post.tags;
  // }
}
