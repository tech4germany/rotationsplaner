import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'RotationsplanerWebPartStrings';
import Rotationsplaner from './components/Rotationsplaner';
import { IRotationsplanerProps } from './components/IRotationsplanerProps';
import Api from './api/api';

export interface IRotationsplanerWebPartProps {
  description: string;
}

export default class RotationsplanerWebPart extends BaseClientSideWebPart<IRotationsplanerWebPartProps> {

  public onInit(): Promise < void> {
    return super.onInit().then(_ => {
      Api.init(this.context);
    });
  }

  public render(): void {
    const element: React.ReactElement<IRotationsplanerProps > = React.createElement(
      Rotationsplaner,
      {
        description: this.properties.description,
        name: 'Luise',
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
