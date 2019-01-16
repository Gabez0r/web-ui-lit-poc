/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { customElement, html, LitElement, property } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons';
import './snack-bar';

@customElement('my-app')
class MyApp extends LitElement {
  @property({ type: String })
  public appTitle: string = '';

  @property({ type: String })
  protected _page: string = 'doc';

  @property({ type: Boolean })
  protected _drawerOpened: boolean = false;

  @property({ type: Boolean })
  protected _snackbarOpened: boolean = false;

  @property({ type: Boolean })
  protected _offline: boolean = false;

  @property({ type: Object })
  private __snackbarTimer?: number;

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <style>
        :host {
          --app-drawer-width: 256px;
          display: block;

          --app-primary-color: #e91e63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909c;

          /* -- Nuxeo Branding colors -- */
          --nuxeo-primary-color: #ccc;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
        drawer button, and the text looks not centered. Add a padding to
        match that button */
          padding-right: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          /* min-height: 100vh; */
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }
      </style>

      <!-- Drawer content -->
      <app-drawer-layout>
        <app-drawer swipe-open slot="drawer">
          <nav class="drawer-list">
            <a ?selected="${this._page === 'doc'}" href="/doc">Doc Browser</a>
            <a ?selected="${this._page === 'browse'}" href="/browse">Browse</a>
          </nav>
        </app-drawer>

        <!-- Header -->
        <app-header-layout>
          <app-header
            condenses
            reveals
            shadow
            effects="blend-background parallax-background waterfall"
          >
            <app-toolbar class="toolbar-top">
              <button class="menu-btn" title="Menu" drawer-toggle>
                ${menuIcon}
              </button>
              <div main-title>${this.appTitle}</div>
            </app-toolbar>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <doc-reader
              class="page"
              ?active="${this._page === 'doc'}"
            ></doc-reader>
            <poc-browser
              class="page"
              ?active="${this._page === 'browse'}"
            ></poc-browser>
            <my-view404
              class="page"
              ?active="${this._page === 'view404'}"
            ></my-view404>
          </main>
        </app-header-layout>
      </app-drawer-layout>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.</snack-bar
      >
    `;
  }

  protected firstUpdated() {
    installRouter(() => this._locationChanged());
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`, () => this._layoutChanged());
  }

  protected updated(changedProps: Map<string, object>) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        description: pageTitle,
        title: pageTitle,
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  private _layoutChanged() {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    // this._updateDrawerState(false);
  }

  private _offlineChanged(offline: boolean) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }
    window.clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = window.setTimeout(() => {
      this._snackbarOpened = false;
    }, 3000);
  }

  private _locationChanged() {
    const path = decodeURIComponent(window.location.pathname);
    const page = path === '/' ? 'doc' : path.slice(1);
    this._loadPage(page);
  }

  private _loadPage(page: string) {
    switch (page) {
      case 'doc':
        import(/* webpackChunkName: "doc-reader" */ '../components/doc-reader');
        break;
      case 'browse':
        import(/* webpackChunkName: "poc-browser" */ '../components/poc-browser');
        break;
      default:
        page = 'view404';
        import(/* webpackChunkName: "view404" */ '../components/my-view404');
    }

    this._page = page;
  }
}
