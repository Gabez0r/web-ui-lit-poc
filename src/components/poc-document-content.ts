import { customElement, html, LitElement, property, query } from 'lit-element';

import '@nuxeo/nuxeo-elements/nuxeo-document';
import '@nuxeo/nuxeo-elements/nuxeo-page-provider';
import './nuxeo-documents-table';

@customElement('poc-document-content')
class DocumentContent extends LitElement {
  @property({ type: Object })
  public enrichers = { document: ['favorites'] };

  @property({ type: Object })
  protected document?: Nuxeo.Document;

  @property({ type: Array })
  protected _children: Nuxeo.Document[] = [];

  @query('#pp')
  protected _pp?: Nuxeo.PageProvider;

  protected render() {
    return html`
      <nuxeo-page-provider
        id="pp"
        provider="advanced_document_content"
        enrichers="thumbnail"
        @current-page-changed="${(e: CustomEvent) =>
          (this._children = e.detail.value)}"
      >
      </nuxeo-page-provider>

      <nuxeo-documents-table
        class="results"
        .documents="${this._children}"
      ></nuxeo-documents-table>
    `;
  }

  protected updated(changedProperties: Map<string, object>) {
    if (changedProperties.has('document')) {
      if (this._pp && this.document) {
        this._pp.params = this.document
          ? { ecm_parentId: this.document.uid, ecm_trashed: false }
          : {};
        this._pp.fetch();
      }
    }
  }
}
