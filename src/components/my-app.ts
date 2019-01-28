/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import '@nuxeo/nuxeo-elements/nuxeo-connection';
import { RoutingBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-routing-behavior.js';
// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { Polymer } from '@polymer/polymer/polymer-legacy.js';
(window as any).Polymer = Polymer;
// @ts-ignore
import { Router } from '@vaadin/router';
import { customElement, html, LitElement, property } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { menuIcon } from './my-icons';
import './snack-bar';

import {
  get,
  ITranslationConfig,
  Key,
  LanguageIdentifier,
  registerTranslateConfig,
  Strings,
  translate,
  use,
} from '@appnest/lit-translate';

// setup localization
registerTranslateConfig({
  loader: (lang: LanguageIdentifier) =>
    import(/* webpackChunkName: "i18n/[request]" */
    `../i18n/messages${lang && lang !== 'en' ? `-${lang}` : ''}.json`).then(
      (res) => res,
    ),
  lookup: (key: Key, config: ITranslationConfig) => {
    // add a custom lookup function because the default splits keys by `.`
    const translations: Strings | null = config.strings;
    return (
      translations && (translations[key] ? translations[key].toString() : key)
    );
  },
});

// setup window object
const myWindow = window as any;
myWindow.nuxeo = myWindow.nuxeo || {};
myWindow.nuxeo.I18n = myWindow.nuxeo.I18n || {};

const supportedLanguages = ['en', 'fr', 'pt-PT'];

@customElement('my-app')
class MyApp extends LitElement {
  @property({ type: String })
  public appTitle: string = '';

  @property({ type: String })
  public baseUrl: string = '';

  @property({ type: String })
  protected _page: string = 'doc';

  @property({ type: Boolean })
  protected _drawerOpened: boolean = false;

  @property({ type: Boolean })
  protected _snackbarOpened: boolean = false;

  @property({ type: Boolean })
  protected _offline: boolean = false;

  @property({ type: String })
  protected _route: string = '';

  @property({ type: String })
  protected _language: string = '';

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

          --icon-toggle-pressed-color: var(--app-primary-color);

          height: 100%;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
          position: absolute;
          top: 8px;
          left: 0;
        }

        .menu-btn > * {
          pointer-events: none;
        }

        .drawer-list {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
          text-align: center;
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

        .main-content > * {
          display: block;
        }

        .drawer-list-footer {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          flex: 1 1 auto;
        }

        .lang-select {
          width: 100%;
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }
      </style>

      <nuxeo-connection url="${this.baseUrl}"></nuxeo-connection>

      <!-- Drawer content -->
      <app-drawer-layout>
        <app-drawer swipe-open slot="drawer">
          <nav class="drawer-list">
            <a ?selected="${this._page === 'browse'}" href="/browse"
              >${translate('app.menu.browse')}</a
            >
            <a ?selected="${this._page === 'search'}" href="/search"
              >${translate('app.menu.search')}</a
            >
            <div class="drawer-list-footer">
              <div class="lang-select">
                <span>Language:</span>
                <select
                  id="langSelect"
                  value="${this._language}"
                  @change="${async (e: Event) =>
                    this._loadLang(this._getSelectedLang())}"
                >
                  ${repeat(
                    supportedLanguages,
                    (lang) => html`
                      <option value="${lang}">${lang}</option>
                    `,
                  )}
                </select>
              </div>
            </div>
          </nav>
        </app-drawer>
        <!-- Header -->
        <app-header-layout>
          <!-- Main content -->
          <main role="main" class="main-content"></main>
        </app-header-layout>
        <button class="menu-btn" title="Menu" drawer-toggle>${menuIcon}</button>
      </app-drawer-layout>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.</snack-bar
      >
    `;
  }

  protected firstUpdated() {
    installOfflineWatcher((offline) => this._offlineChanged(offline));

    // setup routing
    const content =
      this.shadowRoot && this.shadowRoot.querySelector('.main-content');
    const router = new Router(content, { baseUrl: '/' });
    router.setRoutes([
      { path: '/', redirect: '/doc' },
      {
        action: () =>
          import(/* webpackChunkName: "browser" */ '../components/poc-browser').then(
            () => this._loadPage('browse'),
          ),
        component: 'poc-browser',
        name: 'browse',
        path: '/browse:path(.*)',
      },
      {
        action: () =>
          import(/* webpackChunkName: "search" */ '../components/poc-search').then(
            () => this._loadPage('search'),
          ),
        component: 'poc-search',
        name: 'search',
        path: '/search',
      },
      {
        action: () =>
          import(/* webpackChunkName: "404" */ '../components/my-view404').then(
            () => this._loadPage(''),
          ),
        component: 'my-view404',
        path: '(.*)',
      },
    ]);

    // define legacy router for elements using `nuxeo-router-behavior`
    RoutingBehavior.__router = {
      baseUrl: '/',
      useHashbang: false,
      browse(path: string) {
        return decodeURIComponent(
          router.urlForName('browse', { path }),
        ).replace(/^\//, '');
      },
    };

    this._loadLang(this._getSelectedLang());
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

  private async _loadLang(lang: string) {
    use(lang).then(() => {
      const mustUpdate = !!myWindow.nuxeo.I18n.translate;
      myWindow.nuxeo.I18n.translate = (key: string) => get(key);
      if (mustUpdate) {
        document.dispatchEvent(new Event('i18n-locale-loaded'));
      }
    });
  }

  private _getSelectedLang() {
    const select: HTMLSelectElement | null =
      this.shadowRoot && this.shadowRoot.querySelector('#langSelect');
    return (select && select.selectedOptions[0].value) || 'en';
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

  private _loadPage(page: string) {
    this._page = page;
  }
}
