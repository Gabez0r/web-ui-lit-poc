declare namespace Nuxeo {
  class DocumentPreview {
    document: Nuxeo.Document;
    xpath: string;
  }
}

interface HTMLElementTagNameMap {
  'nuxeo-document-preview': Nuxeo.DocumentPreview;
}
