import '@nuxeo/nuxeo-elements/nuxeo-element.js';
import '@nuxeo/nuxeo-ui-elements/nuxeo-data-table/iron-data-table';
import { I18nBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js';
import '@polymer/iron-icon/iron-icon';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html } from '@polymer/polymer/polymer-element';

class DocsTable extends mixinBehaviors([I18nBehavior], Nuxeo.Element) {
  static get template() {
    return html`
      <style>
        nuxeo-data-table {
          height: 400px;
        }
      </style>

      <nuxeo-data-table items=[[documents]]
                        empty-label="[[i18n('documentsTable.empty')]]"
                        empty-label-when-filtered="[[i18n('documentsTable.filtering.empty')]]">
        <nuxeo-data-table-column name="[[i18n('documentsTable.icon')]]">
          <template>
            <iron-icon src="[[item.contextParameters.thumbnail.url]]">
          </template>
        </nuxeo-data-table-column>
        <nuxeo-data-table-column name="[[i18n('documentsTable.title')]]">
          <template>[[item.title]]</template>
        </nuxeo-data-table-column>
        <nuxeo-data-table-column name="[[i18n('documentsTable.lastModified')]]">
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
// @ts-ignore
customElements.define('nuxeo-documents-table', DocsTable);
