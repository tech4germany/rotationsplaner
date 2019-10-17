export type HTML = string; // HTML string

export class Contact {
  public readonly name: string;
  public readonly id: number;

  // other fields caused problems in our test instance
  // later add 'Kontakt/EMail', 'Kontakt/WorkPhone';
  public static queryFields: string[] = ['Ansprechpartner/Name', 'Ansprechpartner/Id'];

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

  public readonly id: number; // references Task Id, not TaskProgress Id
  public readonly title: string;
  public readonly category: CategoryDto;
  public readonly detailText?: string;
  public readonly ordinance?: HTML;  // Gesetz
  public readonly form?: HTML;   // Formular
  public readonly pointsOfContact?: Contact[];
  public readonly showOnlyFor?: string[]; // Preference.title referenced in Task.Bedingungen
  public readonly showOnlyForLocation?: string;

  public checked: boolean = false;
  public isArchived: boolean = false;

  constructor(
    id: number, title: string, checked: boolean, isArchived: boolean, category: CategoryDto,
    detailText?: string, ordinance?: HTML, form?: HTML,
    pointsOfContact?: Contact[], showOnlyFor?: string[], showOnlyForLocation?: string
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
    if (data.Ansprechpartner) {
      contacts = data.Ansprechpartner.map(Contact.deserialize);
    }

    const category = CategoryDto.deserialize(data.Kategorie1);

    return new Task(
      data.ID,
      data.Title,
      undefined,
      undefined,
      category,
      data.Beschreibung,
      data.Gesetz,  // "Sonstige Links" in the UI
      data.Formular,
      contacts,
      data.Bedingungen ? data.Bedingungen.map(b => b.Title) : [],
      data.Dienstort ? data.Dienstort.Title : undefined
    );
    // TODO remaining fields
  }

  public shouldShowForPreferences(preferences: string[]): boolean {
    if (this.showOnlyFor.length == 0 && !this.showOnlyForLocation) {
      return true;
    }
    return preferences.some(preference =>
      this.showOnlyFor.indexOf(preference) !== -1 || this.showOnlyForLocation == preference
    );
  }
}

export class Category {
  public readonly name: string;
  public tasks: AnyTask[];
  public sortingKey: number;

  constructor(name: string, sortingKey: number, tasks: AnyTask[]) {
    this.name = name;
    this.tasks = tasks;
    this.sortingKey = sortingKey;
  }

  public tasksForPreferences(preferences: string[]): AnyTask[] {
    return this.tasks.filter(t => t.shouldShowForPreferences(preferences));
  }

  // category for misc, own tasks
  public get isOtherCategory(): boolean {
    return this.name == Category.otherCategoryName;
  }

  public static createOther(): Category {
    return new Category(Category.otherCategoryName, 10000, []);
  }

  private static otherCategoryName = "Sonstige";
}

export class CategoryDto {
  public readonly name: string;
  public readonly sortingKey: number;

  constructor(name: string, sortingKey: number) {
    this.name = name;
    this.sortingKey = sortingKey;
  }

  public static deserialize(data: any): CategoryDto {
    return new CategoryDto(data.Title, data.Reihenfolge);
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
      dienstortId: data.Dienstort.ID,
      location: data.Dienstort.Location
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
