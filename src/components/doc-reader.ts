import '@nuxeo/nuxeo-elements/nuxeo-connection';
import '@nuxeo/nuxeo-elements/nuxeo-document';
import '@nuxeo/nuxeo-elements/nuxeo-page-provider';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-document-suggestion';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-file';
import { customElement, html, property, query } from 'lit-element';
import './nuxeo-documents-table';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('doc-reader')
class DocReader extends PageViewElement {
  @property({ type: Object })
  public doc: any;

  @property({ type: String })
  public docPath: string = '';

  @property({ type: Object })
  public params: object = {};

  @property({ type: String })
  public path: string = '';

  @query('#pp')
  public _pp?: Nuxeo.PageProvider;

  @property({ type: Array })
  protected _children: object[] = [];

  protected render() {
    const { path, doc, params, _children } = this;
    const contributors = doc && doc.properties['dc:contributors'];
    const isFolderish = doc && doc.facets.indexOf('Folderish') !== -1;
    const router = {
      browse: () => '#',
    };

    return html`
      ${SharedStyles}
      <nuxeo-connection url="http://localhost:8080/nuxeo"></nuxeo-connection>

      <nuxeo-document-suggestion
        .router="${router}"
        placeholder="Select a document"
        @selected-item-changed="${
          (e: CustomEvent) => this._select(e.detail.value)
        }"
      >
      </nuxeo-document-suggestion>

      <nuxeo-document
        auto
        doc-path="${path}"
        @response-changed="${(e: CustomEvent) => (this.doc = e.detail.value)}"
      ></nuxeo-document>

      <nuxeo-page-provider
        auto
        id="pp"
        provider="advanced_document_content"
        enrichers="thumbnail"
        .params="${params}"
        @current-page-changed="${
          (e: CustomEvent) => (this._children = e.detail.value)
        }"
      >
      </nuxeo-page-provider>

      ${
        doc
          ? html`
              <h2>Title: ${doc.title}</h2>
              <p>ID: ${doc.uid}</p>
              <p>Repository: ${doc.repository}</p>
              <p>State: ${doc.state}</p>

              <h3>Contributors:</h3>
              <ul>
                ${
                  contributors.map(
                    (contributor: string) =>
                      html`
                        <li>${contributor}</li>
                      `,
                  )
                }
              </ul>

              ${
                isFolderish
                  ? html`
                      <div class="flex">
                        <h3>Upload files:</h3>
                        <nuxeo-file
                          @value-changed="${this.importFile}"
                        ></nuxeo-file>
                      </div>
                      <h3>_children:</h3>
                      <nuxeo-documents-table
                        .documents="${_children}"
                      ></nuxeo-documents-table>
                    `
                  : ''
              }
            `
          : ''
      }
    `;
  }

  protected importFile(event: any) {
    const context = { currentDocument: this.path };
    event.target
      .batchExecute('FileManager.Import', { context }, { nx_es_sync: 'true' })
      .then(() => (event.target.value = undefined))
      .then(() => {
        if (this._pp) {
          this._pp.fetch();
        }
      });
  }

  private _select(doc: any) {
    if (doc) {
      this.path = doc.path;
      this.params = { ecm_parentId: doc.uid };
    } else {
      this.path = '';
      this.doc = undefined;
      this.params = {};
    }
  }
}
