import { customElement, html, property, query } from 'lit-element';
import { PageViewElement } from './page-view-element';

import '@nuxeo/nuxeo-elements/nuxeo-document';
import '@nuxeo/nuxeo-elements/nuxeo-page-provider';
import '@nuxeo/nuxeo-ui-elements/actions/nuxeo-favorites-toggle-button';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-document-suggestion';

import { translate } from '@appnest/lit-translate';
import './poc-document-content';
import './poc-document-layout';
import './poc-document-viewer';
import './poc-page';

import '@polymer/marked-element/marked-element.js';
import 'cropperjs/dist/cropper.js';

import { SharedStyles } from './shared-styles';

@customElement('poc-browser')
class Browser extends PageViewElement {
  @property({ type: String })
  public path: string = '';

  @property({ type: Object })
  public enrichers = { document: ['favorites', 'preview'] };

  @property({ type: Object })
  protected document?: Nuxeo.Document;

  @property({ type: Boolean })
  protected _isQuickSearching: boolean = false;

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
          align-items: center;
        }
        .path {
          margin-left: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .quick-search {
          margin-top: 16px;
          text-align: center;
        }
      </style>

      <nuxeo-document
        auto
        doc-path="${this.path}"
        .enrichers="${this.enrichers}"
        @response-changed="${(e: CustomEvent) =>
          e.detail.value && (this.document = e.detail.value)}"
      ></nuxeo-document>

      <poc-page>
        <div slot="header" class="header">
          <span>${translate('app.menu.browse')}:</span>
          <span class="path">${this.document && this.document.path}</span>
          <nuxeo-favorites-toggle-button
            .document="${this.document}"
          ></nuxeo-favorites-toggle-button>
        </div>
        <div class="content">
          <poc-document-layout
            .document="${this.document}"
            layout="view"
            @row-clicked="${(e: CustomEvent) => {
              if (e.detail.item) {
                this.navigateToLocation(
                  'path',
                  this.document && e.detail.item.path,
                );
              }
            }}"
          ></poc-document-layout>
          <div class="quick-search">
            ${this._isQuickSearching
              ? html`
                  <nuxeo-document-suggestion
                    placeholder="${translate(
                      'poc.browser.quickSearch.placeholder',
                    )}"
                    @selected-item-changed="${(e: CustomEvent) => {
                      this.navigateToLocation('path', e.detail.value.path);
                      this._isQuickSearching = false;
                    }}"
                  ></nuxeo-document-suggestion>
                `
              : ``}
            ${!this._isQuickSearching
              ? html`
                  <a
                    href="javascript:undefined"
                    @click="${() => (this._isQuickSearching = true)}"
                    >${translate('poc.browser.quickSearch.trigger')}</a
                  >
                `
              : ''}
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
  }
}
