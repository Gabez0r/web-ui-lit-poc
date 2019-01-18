import { customElement, html, property, query } from 'lit-element';
import { PageViewElement } from './page-view-element';

import '@nuxeo/nuxeo-elements/nuxeo-document';
import '@nuxeo/nuxeo-elements/nuxeo-page-provider';

import './nuxeo-documents-table';
import './poc-page';

import { SharedStyles } from './shared-styles';

@customElement('poc-browser')
class PocBrowser extends PageViewElement {
  @property({ type: String })
  public path: string = '';

  @property({ type: Object })
  protected document?: Nuxeo.Document;

  @property({ type: Array })
  protected _children: Nuxeo.Document[] = [];

  @query('#pp')
  protected _pp?: Nuxeo.PageProvider;

  protected render() {
    return html`
      ${SharedStyles}
      <style>
        .content {
          margin-top: 8px;
        }
      </style>

      <nuxeo-document
        auto
        doc-path="${this.path}"
        @response-changed="${
          (e: CustomEvent) => {
            this.document = e.detail.value;
          }
        }"
      ></nuxeo-document>

      <nuxeo-page-provider
        id="pp"
        provider="advanced_document_content"
        enrichers="thumbnail"
        @current-page-changed="${
          (e: CustomEvent) => (this._children = e.detail.value)
        }"
      >
      </nuxeo-page-provider>

      <poc-page>
        <div slot="header" main-title>
          ${this.document && this.document.path}
        </div>
        <div class="content">
          <nuxeo-documents-table
            .documents="${this._children}"
            @row-clicked="${
              (e: CustomEvent) => {
                if (e.detail.item) {
                  this.pushUrlForLocation('path', this.document && e.detail.item.path);
                }
              }
            }"
          ></nuxeo-documents-table>
        </div>
      </poc-page>
    `;
  }

  protected updated(changedProperties: Map<string, object>) {
    if (changedProperties.has('location')) {
      if (this.location && this.location.params.path) {
        this.path = this.location.params.path;
      } else if (!this.path) {
        this.path = '/';
      }
    }
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
