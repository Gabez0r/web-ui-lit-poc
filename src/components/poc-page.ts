import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { customElement, html, LitElement, property, query } from 'lit-element';
import { menuIcon } from './my-icons';
import { PageViewElement } from './page-view-element';

@customElement('poc-page')
class PocPage extends LitElement {
  protected render() {
    return html`
      <style>
        app-header {
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
          margin-left: 32px;
        }

        .toolbar-top > div {
          position: relative;
          width: 100%;
        }
      </style>
      <app-header
        condenses
        reveals
        shadow
        effects="blend-background parallax-background waterfall"
      >
        <app-toolbar class="toolbar-top">
          <div part="page-header">
            <slot name="header"></slot>
          </div>
        </app-toolbar>
      </app-header>
      <div part="page-content"><slot></slot></div>
    `;
  }
}
