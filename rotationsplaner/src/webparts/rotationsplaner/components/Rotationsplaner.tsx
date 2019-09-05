import * as React from 'react';
import styles from './Rotationsplaner.module.scss';
import { IRotationsplanerProps } from './IRotationsplanerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ChecklistSection from './ChecklistSection';

const umzugsListItems = [{
  title: "Speditionen Anfragen",
  description: "Sie wollten frühstmöglich mehrere Angebote von verschiedenen Speditionen einholen, damit sie das beste Angebot finden können"
}, {
  title: "WBR Beantragen",
  description: "Die WBR (Wohnungs-Besichtigungs-Reise) sollte rechtzeitig beantragt werden, damit sie sich frühzeitig um Termien vorort kümmern können",
  link: {title: "WBR Formular", target: "http://forms.diplo.com"}
}];
const WohnungsListItems = [{title: "Markler Termine"}, {title: "Mietspiegel Checken"}];

export default class Rotationsplaner extends React.Component < IRotationsplanerProps, {} > {
  public render(): React.ReactElement<IRotationsplanerProps> {
    return(
      <div className = { styles.rotationsplaner } >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Hallo {escape(this.props.name)}!</span>

              <p className={styles.subTitle}>Für eine personalisierte Checkliste benötigen wir ein paar Informationen.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <a href='https://aka.ms/spfx' className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <ChecklistSection items={umzugsListItems} title={"Umzug"}/>
              <ChecklistSection items={WohnungsListItems} title={"Wohnung"}/>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
