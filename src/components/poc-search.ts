import { customElement, html, property, query } from 'lit-element';
import { PageViewElement } from './page-view-element';
import './poc-page';

import { SharedStyles } from './shared-styles';

@customElement('poc-search')
class PocBrowser extends PageViewElement {
  protected render() {
    return html`
      ${SharedStyles}
      <poc-page>
        <div slot="header" main-title>Search</div>
        <div class="content">TODO</div>
      </poc-page>
    `;
  }
}
