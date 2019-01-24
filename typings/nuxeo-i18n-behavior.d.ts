// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

/**
 * `Nuxeo.I18nBehavior` provides a `i18n` helper function for translations.
 */
declare module '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js' {
  interface I18nBehavior {
    /**
     * Returns the translation for the given key.
     */
    readonly i18n: Function | null | undefined;
  }

  const I18nBehavior: I18nBehavior;

  const XHRLocaleResolver: (folder: string) => Promise<any>;
}
