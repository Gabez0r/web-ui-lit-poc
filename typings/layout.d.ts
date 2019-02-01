declare namespace Nuxeo {
  class Layout {
    /** The children of the current element. */
    children?: Layout[];
    /** Defines the custom element. */
    is?: string;
    /** The fields to which the current element is bound */
    fields?: string[];
    /** The current element's attributes */
    attributes?: Map<string, { value: string; property: boolean; boolean: boolean }>;
    /** The direction of the current element (maps to flex-direction). */
    direction?: string;
    /** Whether this elements wraps it's children or not (maps to flex-wrap: wrap) */
    wrap?: boolean;
    /** How much space this element takes in comparison to its siblings (maps to flex factor) */
    weight?: number;
    /** The element's text content. */
    text?: string;
    /** Overrides the element's style (advanced). */
    style?: string;
    /** Overrides the element's classes (advanced). */
    classList?: string[];
    /** Overrides the element's innerHTML (advanced). */
    html?: string;
  }
  class LayoutElement extends Layout {
    is: string;
    text: string;
  }
}
