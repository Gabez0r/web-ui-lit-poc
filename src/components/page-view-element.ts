/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement, property } from 'lit-element';

export class PageViewElement extends LitElement {
  @property({ type: Boolean })
  public location?: { params: any; getUrl(params: any): string };

  public urlForLocation(name: string, value: any) {
    if (this.location) {
      return decodeURIComponent(this.location.getUrl({ [name]: value }));
    }
  }

  public navigateToLocation(name: string, value: any) {
    const url = this.urlForLocation(name, value);
    if (url) {
      history.pushState(null, `${name}: ${value}`, url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }
}
