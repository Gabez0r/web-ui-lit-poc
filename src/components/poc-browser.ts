import { customElement, html, property, query } from 'lit-element';
import { PageViewElement } from './page-view-element';

import '@nuxeo/nuxeo-elements/nuxeo-document';
import '@nuxeo/nuxeo-elements/nuxeo-page-provider';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-document-suggestion';

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

  @property({ type: Boolean })
  protected _isQuickSearching: boolean = false;

  @query('#pp')
  protected _pp?: Nuxeo.PageProvider;

  protected render() {
    return html`
      ${SharedStyles}
      <style>
        .content {
          margin-top: 8px;
        }
        .header {
          display: flex;
          flex-direction: row;
          flex: 1 1 0.000000001px;
        }
        .path {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
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
        <div slot="header" class="header">
          <span class="path">${this.document && this.document.path}</span>
        </div>
        <div class="content">
          <nuxeo-documents-table
            class="results"
            .documents="${this._children}"
            @row-clicked="${
              (e: CustomEvent) => {
                if (e.detail.item) {
                  this.navigateToLocation(
                    'path',
                    this.document && e.detail.item.path,
                  );
                }
              }
            }"
          ></nuxeo-documents-table>
          <div>
            ${
              this._isQuickSearching
                ? html`
                    <nuxeo-document-suggestion
                      placeholder="Search here for a document"
                      @selected-item-changed="${
                        (e: CustomEvent) => {
                          this.navigateToLocation('path', e.detail.value.path);
                          this._isQuickSearching = false;
                        }
                      }"
                    ></nuxeo-document-suggestion>
                  `
                : ``
            }
            ${
              !this._isQuickSearching
                ? html`
                    <a
                      href="javascript:undefined"
                      @click="${() => (this._isQuickSearching = true)}"
                      >Didn't find what you were looking for?</a
                    >
                  `
                : ''
            }
          </div>
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
