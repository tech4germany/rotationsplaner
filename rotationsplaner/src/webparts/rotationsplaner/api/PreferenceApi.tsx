import {sp} from '@pnp/sp';
import {Preference} from "../classes/Checklist";

export default class PreferenceApi {


  /**
   * Fetch all preferences (checked/unchecked) made by the current user and add them to the preferences instances
   */


  public static async fetchPreferences(): Promise<Preference[]> {
    const globalPrefs = await this.fetchGlobalPreferences();
    const userPrefs = await this.fetchUserPreferences();

    return this.mergePrefs(globalPrefs, userPrefs);
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
    const currentUser = await sp.web.currentUser.get();
    return sp.web.lists.getByTitle('UserPreferences').items
      .filter(`AuthorId eq ${currentUser.Id}`)
      .select('Title', 'Checked')
      .get();
  }
}
