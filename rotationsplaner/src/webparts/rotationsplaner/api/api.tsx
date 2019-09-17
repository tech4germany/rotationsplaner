
import { sp } from "@pnp/sp";
import { SPFetchClient } from "@pnp/nodejs";
import {Category, Task} from "../classes/Checklist";

const sharepointUrl = 'http://sharepoint-is-live.com';
const clientId = '42';
const clientSecret = 'Not42';

// configure your node options (only once in your application)
// sp.setup({
//   sp: {
//     fetchClientFactory: () => {
//       return new SPFetchClient(sharepointUrl, clientId, clientSecret);
//     },
//   },
// });

const umzug: Category = {
  name: 'Umzug',
  tasks: [
    new Task({
      id: "1",
      name: "Speditionen anfragen",
      isCustom: false,
      detailText: "Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können"
    }, false, undefined),
    new Task({
      id: "2",
      name: "WBR beantragen",
      detailText: "Die WBR (Wohnungsbesichtigungsreise) sollte rechtzeitig beantragt werden, damit Sie sich frühzeitig um Termine vor Ort kümmern können.",
      isCustom: false,
      links: [{description: "WBR Formular", uri: "http://forms.diplo.com"}]
    }, false, undefined)
  ]
};
const wohnung: Category = {
  name: 'Wohnung',
  tasks: [
    new Task({
      id: "w1",
      name: "Maklertermine vereinbaren",
      isCustom: false,
    }, false, undefined),
    new Task({
        id: "w2",
        name: "Mietspiegel überprüfen",
        isCustom: false,
        links: []
      },
      false, undefined)
  ]
};

const categories = [umzug, wohnung]


export default class Api {

  public static fetchTask(): Promise<Task[]> {
    return Promise.resolve([]);
  }

  public static fetchCategories(): Promise<Category[]> {

    // make a call to SharePoint and log it in the console
    // sp.web.select("Title", "Description").get().then(w => {
    //   console.log(JSON.stringify(w, null, 4));
    // });

    return Promise.resolve(categories);
  }

}
