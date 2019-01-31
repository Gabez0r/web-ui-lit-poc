declare namespace Nuxeo {
  class Layout {
    layout?: string;
    style?: string;
    is?: string;
    elements?: Layout[];
    content?: string;
  }
  class LayoutElement extends Layout {
    is: string;
    content: string;
  }
}
