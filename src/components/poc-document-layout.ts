import { customElement, html, LitElement, property, query } from 'lit-element';

import '@nuxeo/nuxeo-ui-elements/nuxeo-layout';

@customElement('poc-document-layout')
class DocumentLayout extends LitElement {
  public get document(): Nuxeo.Document | undefined {
    return this._document;
  }

  public set document(document: Nuxeo.Document | undefined) {
    this._document = document;
    this._model = { document };
  }

  public get layout() {
    return this._layout;
  }

  public set layout(type: string) {
    this._layout = type;
  }

  @property({ type: Object })
  protected _document?: Nuxeo.Document;

  @property({ type: String })
  protected _layout: string = 'view';

  @property({ type: Object })
  protected _model?: { document?: Nuxeo.Document };

  protected shouldUpdate() {
    return !!(this._document && this._layout);
  }

  protected render() {
    return html`
      <nuxeo-layout
        href="${this._generateHref(this._document, this._layout)}"
        .model="${this._model}"
      ></nuxeo-layout>
    `;
  }

  protected _generateHref(
    document: Nuxeo.Document | undefined,
    layout: string,
  ): string | undefined {
    if (document && document.type && layout) {
      const doctype = document.type.toLowerCase();
      const name = ['nuxeo', doctype, layout, 'layout'].join('-');
      return `layouts/document/${doctype}/${name}.html`;
    }
  }
}
