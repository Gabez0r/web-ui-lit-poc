import { customElement, html, property, query } from 'lit-element';
import { PageViewElement } from './page-view-element';

import { SharedStyles } from './shared-styles';

@customElement('poc-browser')
class PocBrowser extends PageViewElement {
  protected render() {
    return html`
      ${SharedStyles}
      <div>TODO</div>
    `;
  }
}
