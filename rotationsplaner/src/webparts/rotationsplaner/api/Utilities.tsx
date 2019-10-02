import {ItemAddResult, ItemUpdateResult, List} from "@pnp/sp";

export default class Utilities {
  public static async upsert(payload: any, list: List, existingItemFilter: string) {
    const existingItemQuery = await list.items
      .filter(existingItemFilter)
      .select('Id')
      .top(1).get();

    const itemExists = existingItemQuery.length > 0;
    if(itemExists) {
      const idForUpdate = existingItemQuery[0].Id;
      return this.update(idForUpdate, payload, list);
    } else {
      return this.add(payload, list);
    }
  }

  public static update(id: any, payload: any, list: List): Promise<ItemUpdateResult> {
    return list.items.getById(id).update(payload);
  }

  public static add(payload: any, list: List): Promise<ItemAddResult> {
    return list.items.add(payload);
  }

  public static async deleteAllCreatedByUser(currentUserId: string, list: List): Promise<void> {
    const items = await list.items
      .filter(`AuthorId eq ${currentUserId}`)
      .select('Id')
      .get();
    console.log('deleting', items);
    const promises = items.map(i => list.items.getById(i.Id).delete());
    const result = await Promise.all(promises);
    console.log('Deleted items from list', list, result);
  }
}
