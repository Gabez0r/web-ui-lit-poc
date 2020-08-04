import { translate } from '@appnest/lit-translate';
import { customElement, html, LitElement, property } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import './poc-page';

import { LayoutStyles } from './poc-layout-test-styles';
import { SharedStyles } from './shared-styles';

function buildElement(el: Nuxeo.Layout) {
  let element: HTMLElement | undefined;
  if (el.is) {
    element = createElement(el as Nuxeo.LayoutElement);
  } else if (el.children) {
    const div = document.createElement('div');
    el.children.forEach((child) => {
      const content = buildElement(child);
      if (content) {
        div.appendChild(content);
      }
    });
    element = div;
  }
  if (element) {
    // add field info to `name` attribute
    if (el.fields) {
      element.setAttribute('name', el.fields.join('_'));
    }
    // set flex direction
    if (el.direction) {
      element.classList.add(...[el.direction, 'flex']);
    }
    // set flex wrap
    if (el.wrap != null) {
      element.classList.add('wrap');
    }
    // set flex grow fraction
    if (el.weight != null) {
      (element as any).style.flex = el.weight.toString();
    }
    // support overriding styles (advanced)
    if (el.style) {
      Object.keys(el.style).forEach((k: string) => {
        // @ts-ignore
        element.style[k] = el.style[k];
      });
    }
    // support overriding classes (advanced)
    if (el.classList) {
      element.classList.add(...el.classList);
    }
    // support overriding innerHTMK (advanced)
    if (el.html) {
      element.innerHTML = el.html;
    }
    // handle grid- properties (advanced)
    Object.keys(el)
      .filter((k) => k.match(/^grid-.*$/))
      .forEach((k) => {
        const camelCaseKey = k.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        (element as any).style[camelCaseKey] = (el as any)[k];
      });
  }
  return element;
}

function createElement(el: Nuxeo.LayoutElement) {
  const div = document.createElement('div');
  div.className = el.is.replace(/-/g, ' ') + ' box';
  const span = document.createElement('span');
  span.textContent = el.text;
  div.appendChild(span);
  if (el.fields) {
    const bindings = document.createElement('span');
    bindings.className = 'bindings';
    bindings.textContent +=
      ` (bound to field${el.fields.length > 1 ? 's' : ''}: ${el.fields.map((f) => `"${f}"`).join(',')})`;
    div.appendChild(bindings);
  }
  return div;
}

const models = [
  // model 1 - simple flex
  {
    name: 'Simple flex layout w/ style, class and innerHTML customization',
    direction: 'vertical', // vertical | horizontal, includes display: flex; flex: 1 1 auto;
    children: [
      {
        is: 'vertical-flex-main',
        text: 'Main content',
      },

      {
        direction: 'horizontal',
        wrap: true, // defaults to false
        children: [
          {
            direction: 'horizontal',
            children: [
              {
                is: 'vertical-flex-secondary',
                fields: ['field1'],
                text: 'Card 1',
              },
            ],
          },
          {
            direction: 'horizontal',
            classList: ['blink'],
            children: [
              {
                is: 'vertical-flex-secondary',
                fields: ['field2'],
                text: 'Card 2',
              },
            ],
          },
          {
            direction: 'horizontal',
            children: [
              {
                is: 'vertical-flex-secondary',
                html: 'Card 3<span class="horizontal flex secondary box">Inner Element</span>',
              },
            ],
          },
        ],
      },

      {
        direction: 'horizontal',
        wrap: true,
        children: [
          {
            direction: 'horizontal',
            children: [
              {
                is: 'vertical-flex-secondary',
                fields: ['field3'],
                text: 'Card 4',
              },
            ],
          },
          {
            direction: 'horizontal',
            style: {
              border: '1px red dashed',
            },
            children: [
              {
                is: 'vertical-flex-secondary',
                fields: ['field4'],
                text: 'Card 5',
              },
            ],
          },
        ],
      },
    ],
  },

  // model 2 - 1 column, main content, a few cards and a footer
  {
    name: 'Responsive flex layout w/ columns',
    direction: 'vertical',
    children: [
      {
        direction: 'horizontal',
        wrap: true,
        children: [
          {
            direction: 'horizontal',
            wrap: true,
            weight: 5, // mapped to flex grow factor
            children: [
              {
                direction: 'vertical',
                wrap: true,
                children: [
                  {
                    is: 'vertical-flex-main',
                    fields: ['field1', 'field2', 'filed3'],
                    text: 'Main Content',
                  },

                  {
                    direction: 'horizontal',
                    wrap: true,
                    children: [
                      {
                        is: 'vertical-flex-secondary',
                        fields: ['field4'],
                        text: 'Card 1',
                      },
                      {
                        is: 'vertical-flex-secondary',
                        fields: ['field5'],
                        text: 'Card 2',
                      },
                      {
                        is: 'vertical-flex-secondary',
                        fields: ['field6'],
                        text: 'Card 3',
                      },
                    ],
                  },

                  {
                    direction: 'horizontal',
                    wrap: true,
                    children: [
                      {
                        is: 'vertical-flex-secondary',
                        fields: ['field7'],
                        text: 'Card 4',
                      },
                      {
                        is: 'vertical-flex-secondary',
                        fields: ['field8'],
                        text: 'Card 5',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            direction: 'horizontal',
            children: [
              {
                is: 'vertical-flex-main',
                fields: ['field9', 'field10'],
                text: 'Side bar',
              },
            ],
          },
        ],
      },

      {
        direction: 'horizontal',
        children: [
          {
            is: 'vertical-flex-bar',
            fields: ['field11'],
            text: 'Some other content',
          },
        ],
      },
    ],
  },

  // model 3 - non-responsive grid layout, with area templates
  {
    'name': 'Grid layout w/ area templates (experimental)',
    'classList': ['grid'],
    'grid-template-areas': `"main main main sidebar"
       "card1 card2 card3 sidebar"
       "card4 card4 card5 sidebar"
       "footer footer footer footer"`,
    'children': [
      {
        'is': 'vertical-flex-main',
        'text': 'Main content',
        'fields': ['field1', 'field2'],
        'grid-area': 'main',
      },
      {
        'is': 'vertical-flex-secondary',
        'text': 'Card 1',
        'fields': ['field3'],
        'grid-area': 'card1',
      },
      {
        'is': 'vertical-flex-secondary',
        'text': 'Card 2',
        'grid-area': 'card2',
      },
      {
        'is': 'vertical-flex-secondary',
        'text': 'Card 3',
        'grid-area': 'card3',
      },
      {
        'is': 'vertical-flex-secondary',
        'text': 'Card 4',
        'grid-area': 'card4',
      },
      {
        'is': 'vertical-flex-secondary',
        'text': 'Card 5',
        'fields': ['field4'],
        'grid-area': 'card5',
      },
      {
        'is': 'vertical-flex-main',
        'text': 'Side bar',
        'grid-area': 'sidebar',
      },
      {
        'is': 'vertical-flex-footer',
        'text': 'Some other content',
        'grid-area': 'footer',
      },
    ],
  },

  // model 4 - responsive grid layout
  {
    'name': 'Kind of responsive grid layout (experimental)',
    'classList': ['grid'],
    'grid-template-columns': 'repeat( auto-fill , minmax(184px, 1fr) )',
    'grid-template-rows': 'auto auto auto auto',
    'grid-auto-flow': 'row dense',
    'children': [
      {
        'is': 'vertical-flex-main',
        'text': 'Main content',
        'fields': ['field1', 'field2', 'field3'],
        'grid-row': '1',
        'grid-column': '1 / -2',
      },
      {
        is: 'vertical-flex-secondary',
        text: 'Card 1',
      },
      {
        is: 'vertical-flex-secondary',
        text: 'Card 2',
      },
      {
        is: 'vertical-flex-secondary',
        text: 'Card 3',
      },
      {
        'is': 'vertical-flex-secondary',
        'text': 'Card 4',
        'grid-column': 'auto / span 2',
      },
      {
        is: 'vertical-flex-secondary',
        fields: ['field4', 'field5'],
        text: 'Card 5',
      },
      {
        'is': 'vertical-flex-main',
        'text': 'Side bar',
        'grid-row': '1 / -1',
      },
      {
        'is': 'vertical-flex-footer',
        'text': 'Some other content',
        'grid-column': '1 / -1',
      },
    ],
  },
];

@customElement('poc-layout-test')
class LayoutTest extends LitElement {
  @property({ type: Number })
  protected model: number = 0;

  @property({ type: Object })
  protected layout: Nuxeo.Layout = models[this.model] as Nuxeo.Layout;

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
        #layout {
          margin-bottom: 32px;
        }
        textarea {
          padding: 8px;
          background-color: black;
          color: white;
          box-sizing: border-box;
          width: 100%;
          height: 800px;
          font-size: 13px;
          font-family: 'Courier';
        }
        .blink {
          animation: blinker 1s linear infinite;
        }
        @keyframes blinker {
          50% {
            opacity: 0;
          }
        }
        .bindings {
          font-size: 12px;
        }
      </style>
      <poc-page>
        <span>Layout</span>
        <div slot="header" class="header">
          <span>${translate('app.layout-test.header')}</span>
          <div id="model-select">
            <span>${translate('app.layout-test.model')}:</span>
            <select
              id="modeSelect"
              value="${this.model}"
              @change="${async () => {
                const select: HTMLSelectElement | null =
                  this.shadowRoot &&
                  this.shadowRoot.querySelector('#modeSelect');
                this.model = Number(select && select.selectedOptions[0].value);
                this.layout = models[this.model] as Nuxeo.Layout;
              }}"
            >
              ${repeat(
                models,
                (m, index) => html`
                  <option value="${index}">${m.name}</option>
                `,
              )}
            </select>
          </div>
        </div>
        <div id="layout">${this.loadModel(this.layout as Nuxeo.Layout)}</div>
        <span>JSON</span>
        <button @click="${this.updateModel}">update</button>
        <textarea id="model">${JSON.stringify(this.layout, null, 4)}</textarea>
      </poc-page>
    `;
  }

  protected loadModel(model: Nuxeo.Layout) {
    if (model) {
      // load model
      const content = buildElement(model);
      // randomize colors
      if (content) {
        content
          .querySelectorAll('.box')
          .forEach(
            (el) =>
              ((el as HTMLElement).style.backgroundColor =
                '#' +
                (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)),
          );
      }
      return content;
    }
  }

  protected updateModel() {
    const model = this.shadowRoot && this.shadowRoot.querySelector('#model') as HTMLTextAreaElement;
    if (model && model.value) {
      this.layout = JSON.parse(model.value);
      this.scrollIntoView();
    }
  }
}
