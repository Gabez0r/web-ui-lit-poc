/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html } from 'lit-element';

export const SharedStyles = html`
  <style>
    :host {
      display: block;
      box-sizing: border-box;
    }

    section {
      padding: 24px;
      background: var(--app-section-odd-color);
    }

    section > * {
      max-width: 600px;
      margin-right: auto;
      margin-left: auto;
    }

    section:nth-of-type(even) {
      background: var(--app-section-even-color);
    }

    h2 {
      font-size: 24px;
      text-align: center;
      color: var(--app-dark-text-color);
    }

    @media (min-width: 460px) {
      h2 {
        font-size: 36px;
      }
    }

    .circle {
      display: block;
      width: 64px;
      height: 64px;
      margin: 0 auto;
      text-align: center;
      border-radius: 50%;
      background: var(--app-primary-color);
      color: var(--app-light-text-color);
      font-size: 30px;
      line-height: 64px;
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
  </style>
`;
