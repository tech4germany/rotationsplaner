import {sp} from '@pnp/sp';
import {Preference} from "../classes/Checklist";
import api from "./api";
import Api from "./api";

export default class PreferenceApi {

  /**
   * Fetch all preferences (checked/unchecked) made by the current user and add them to the preferences instances
   */

  public static async fetchPreferences(): Promise<Preference[]> {
    const globalPrefs : Preference[] = await this.fetchGlobalPreferences();
    const userPrefs : Preference[] = await this.fetchUserPreferences();

    return this.mergePrefs(globalPrefs, userPrefs);
  }

  public static async postPreferences(preferences: Preference[]): Promise<void> {
    if (Api.isDev) {
      return;
    }
    const batch = sp.createBatch();
    const currentPreferences = await this.userPreferencesList.items
      .filter(`AuthorId eq ${api.currentUser.Id}`)
      .select('Id')
      .getAll();
    const itemsToDelete = currentPreferences.map(p => this.userPreferencesList.items.getById(p.Id));
    const deletePromises = itemsToDelete.map(i => i.inBatch(batch).delete());
    const batchItems = this.userPreferencesList.items.inBatch(batch);
    const createPromises = preferences.map(
      p => batchItems.add(Preference.serializeAsUserPreference(p))
    );

    return batch.execute();
  }

  private static async mergePrefs(globalPreferences: Preference[], userPreferences: any): Promise<Preference[]> {
    let userPreferencesMap: { [id: string] : any; } = {};
    userPreferences.forEach(p => userPreferencesMap[p.Title] = p);

    return globalPreferences.map(p => {
      p.checked = userPreferencesMap[p.name] && userPreferencesMap[p.name].Checked || false;
      return p;
    });
  }

  private static fetchGlobalPreferences(): Promise<Preference[]> {
    return sp.web.lists.getByTitle('Preferences').items.get()
      .then((response: any[]) => {
        return response.map(r => new Preference(r));
      });
  }

  private static async fetchUserPreferences(): Promise<Preference[]> {
    return this.userPreferencesList.items
      .filter(`AuthorId eq ${api.currentUser.Id}`)
      .select('Title', 'Checked')
      .getAll();
  }

  private static get userPreferencesList() {
    return sp.web.lists.getByTitle('UserPreferences');
  }
}
