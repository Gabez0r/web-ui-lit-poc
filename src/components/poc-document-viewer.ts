import '@nuxeo/nuxeo-ui-elements/nuxeo-document-preview';
import { customElement, html, LitElement, property } from 'lit-element';

@customElement('poc-document-viewer')
class DocumentViewer extends LitElement {
  @property({ type: Object })
  protected document?: Nuxeo.Document;

  protected render() {
    return html`
      <nuxeo-document-preview
        .document="${this.document}"
      ></nuxeo-document-preview>
    `;
  }
}
