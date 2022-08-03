try {
    importScripts(
      'dependencies/jsdom-min.js',
      'dependencies/msrCrypto.js',
      'bg-initMocks.js',
      'dependencies/msal-browser.min.js',
      'bg-auth.js',
      'bg-serviceWorker.js'
    );
  } catch (e) {
    console.error(e);
  }