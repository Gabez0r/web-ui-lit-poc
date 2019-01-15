import '@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table';
import '@polymer/iron-icon/iron-icon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';

class DocsTable extends PolymerElement {
  static get template() {
    return html`
      <style>
        nuxeo-data-table {
          height: 400px;
        }
      </style>

      <nuxeo-data-table items=[[documents]]>
        <nuxeo-data-table-column name="Icon">
          <template>
            <iron-icon src="[[item.contextParameters.thumbnail.url]]">
          </template>
        </nuxeo-data-table-column>
        <nuxeo-data-table-column name="Title">
          <template>[[item.title]]</template>
        </nuxeo-data-table-column>
        <nuxeo-data-table-column name="Last Modified">
          <template>[[item.lastModified]]</template>
        </nuxeo-data-table-column>
      </nuxeo-data-table>
    `;
  }

  static get properties() {
    return {
      documents: {
        type: Array,
      },
    };
  }
}

customElements.define('nuxeo-documents-table', DocsTable);
