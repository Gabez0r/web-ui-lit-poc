import { translate } from '@appnest/lit-translate';
import { customElement, html, LitElement, property } from 'lit-element';
import './poc-page';

import { LayoutStyles } from './poc-layout-test-styles';
import { SharedStyles } from './shared-styles';

function buildElement(el: Nuxeo.Layout) {
  let element: HTMLElement | undefined;
  if (el.is) {
    element = createElement(el as Nuxeo.LayoutElement);
  } else if (el.elements) {
    const div = document.createElement('div');
    el.elements.forEach((child) => {
      const content = buildElement(child);
      if (content) {
        div.appendChild(content);
      }
    });
    element = div;
  }
  if (element) {
    if (el.layout) {
      element.className = el.layout;
    }
    if (el.style) {
      (element as any).style = el.style;
    }
    Object.keys(el)
      .filter((k) => k.match(/^grid-.*$/))
      .forEach((k) => {
        const ck = k.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        console.log(`setting: ${ck}`);
        (element as any).style[ck] = (el as any)[k];
      });
  }
  return element;
}

function createElement(el: Nuxeo.LayoutElement) {
  const span = document.createElement('span');
  span.className = el.is.replace(/-/g, ' ') + ' box';
  span.textContent = el.content;
  return span;
}

const models = [
  // model 1 - simple flex
  {
    name: 'my-layout-1',
    layout: 'vertical flex',
    elements: [
      {
        is: 'horizontal-flex-main',
        content: 'Main content',
      },

      {
        layout: 'horizontal flex wrap',
        elements: [
          {
            layout: 'horizontal flex',
            elements: [
              {
                is: 'horizontal-flex-secondary',
                content: 'Card 1',
              },
            ],
          },
          {
            layout: 'horizontal flex',
            elements: [
              {
                is: 'horizontal-flex-secondary',
                content: 'Card 2',
              },
            ],
          },
          {
            layout: 'horizontal flex',
            elements: [
              {
                is: 'horizontal-flex-secondary',
                content: 'Card 3',
              },
            ],
          },
        ],
      },

      {
        layout: 'horizontal flex wrap',
        elements: [
          {
            layout: 'horizontal flex',
            elements: [
              {
                is: 'horizontal-flex-secondary',
                content: 'Card 4',
              },
            ],
          },
          {
            layout: 'horizontal flex',
            style: 'border: 1px red dashed',
            elements: [
              {
                is: 'horizontal-flex-secondary',
                content: 'Card 5',
              },
            ],
          },
        ],
      },
    ],
  },

  // model 2 - 1 column, main content, a few cards and a footer
  {
    name: 'my-layout-2',
    layout: 'vertical flex',
    elements: [
      {
        layout: 'horizontal flex wrap',
        elements: [
          {
            layout: 'horizontal flex5 wrap',
            elements: [
              {
                layout: 'vertical flex wrap',
                elements: [
                  {
                    is: 'horizontal-flex-main',
                    content: 'Main Content',
                  },

                  {
                    layout: 'horizontal flex wrap',
                    elements: [
                      {
                        is: 'horizontal-flex-secondary',
                        content: 'Card 1',
                      },
                      {
                        is: 'horizontal-flex-secondary',
                        content: 'Card 2',
                      },
                      {
                        is: 'horizontal-flex-secondary',
                        content: 'Card 3',
                      },
                    ],
                  },

                  {
                    layout: 'horizontal flex wrap',
                    elements: [
                      {
                        is: 'horizontal-flex-secondary',
                        content: 'Card 1',
                      },
                      {
                        is: 'horizontal-flex-secondary',
                        content: 'Card 3',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            layout: 'horizontal flex',
            elements: [
              {
                is: 'vertical-flex-main',
                content: 'Side bar',
              },
            ],
          },
        ],
      },

      {
        layout: 'horizontal flex',
        elements: [
          {
            is: 'horizontal-flex-bar',
            content: 'Some other content',
          },
        ],
      },
    ],
  },

  // model 3 - non-responsive grid layout, with area templates
  {
    'name': 'my-layout-3',
    'layout': 'grid',
    'grid-template-areas': `"main main main sidebar"
       "card1 card2 card3 sidebar"
       "card4 card4 card5 sidebar"
       "footer footer footer footer"`,
    'elements': [
      {
        'is': 'horizontal-flex-main',
        'content': 'Main content',
        'grid-area': 'main',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 1',
        'grid-area': 'card1',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 2',
        'grid-area': 'card2',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 3',
        'grid-area': 'card3',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 4',
        'grid-area': 'card4',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 5',
        'grid-area': 'card5',
      },
      {
        'is': 'vertical-flex-main',
        'content': 'Side bar',
        'grid-area': 'sidebar',
      },
      {
        'is': 'horizontal-flex-footer',
        'content': 'Some other content',
        'grid-area': 'footer',
      },
    ],
  },

  // model 4 - responsive grid layout
  {
    'name': 'my-layout-4',
    'layout': 'grid',
    'grid-template-columns': 'repeat( auto-fill , minmax(184px, 1fr) )',
    'grid-template-rows': 'auto auto auto auto',
    'grid-auto-flow': 'row dense',
    'elements': [
      {
        'is': 'horizontal-flex-main',
        'content': 'Main content',
        'grid-row': '1',
        'grid-column': '1 / -2',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 1',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 2',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 3',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 4',
        'grid-column': 'auto / span 2',
      },
      {
        'is': 'horizontal-flex-box',
        'content': 'Card 5',
      },
      {
        'is': 'vertical-flex-main',
        'content': 'Side bar',
        'grid-row': '1 / -1',
      },
      {
        'is': 'horizontal-flex-footer',
        'content': 'Some other content',
        'grid-column': '1 / -1',
      },
    ],
  },
];

@customElement('poc-layout-test')
class LayoutTest extends LitElement {
  protected render() {
    return html`
      ${LayoutStyles} ${SharedStyles}
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
        }
        .box {
          align-items: center;
          justify-content: center;
          margin: 8px;
          border: 1px solid black;
          box-shadow: 4px 4px 5px 0px gray;
          color: white;
          font-weight: bold;
          font-size: 24px;
          min-width: 168px;
        }
        .main {
          min-height: 300px;
        }
        .secondary {
          min-height: 150px;
        }
        .bar {
          min-height: 64px;
        }
      </style>
      <poc-page>
        <div slot="header" class="header">
          <span>${translate('app.menu.layout-test')}</span>
        </div>
      </poc-page>
    `;
  }

  protected firstUpdated() {
    const page = this.shadowRoot && this.shadowRoot.querySelector('poc-page');
    if (page) {
      // load model
      const content = buildElement(models[0] as Nuxeo.Layout);
      if (content) {
        page.appendChild(content);
      }
      // randomize colors
      page
        .querySelectorAll('.box')
        .forEach(
          (el) =>
            ((el as HTMLElement).style.backgroundColor =
              '#' +
              (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)),
        );
    }
  }
}
