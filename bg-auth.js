const tenant = "common";
const clientId = "your-client-id-here";

const redirectUri = chrome.identity.getRedirectURL();
const msalInstance = new msal.PublicClientApplication({
    auth: {
        authority: `https://login.microsoftonline.com/${tenant}/`,
        clientId,
        redirectUri,
        postLogoutRedirectUri: redirectUri,
        knownAuthorities: ['https://login.microsoftonline.com']
    },
    cache: {
        cacheLocation: "localStorage"
    }
});

/**
 * Generates a login url
 */
 async function getLoginUrl(request, reject) {
    return new Promise((resolve) => {
        msalInstance.loginRedirect({
            ...request,
            onRedirectNavigate: (url) => {
                resolve(url);
                return false;
            }
        }).catch(reject);
    });
}

/**
 * Generates a logout url
 */
async function getLogoutUrl(request) {
    return new Promise((resolve, reject) => {
        msalInstance.logout({
            ...request,
            onRedirectNavigate: (url) => {
                resolve(url);
                return false;
            }
        }).catch(reject);
    });
}


/**
 * Launch the Chromium web auth UI.
 * @param {*} url AAD url to navigate to.
 * @param {*} interactive Whether or not the flow is interactive
 */
async function launchWebAuthFlow(url) {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({
            interactive: true,
            url
        }, (responseUrl) => {
            // Response urls includes a hash (login, acquire token calls)
            if (responseUrl.includes("#")) {
                msalInstance.handleRedirectPromise(`#${responseUrl.split("#")[1]}`)
                    .then(resolve)
                    .catch(reject)
            } else {
                // Logout calls
                resolve();
            }
        })
    })
}

/**
 * EXPOSE signIn and signOut methods globally
 * this enables you to try it from the dev tools console
 * of the service worker
**/
globalThis.signIn = async function() {
    const url = await getLoginUrl();
    const result = await launchWebAuthFlow(url);
    console.log(result);
    chrome.storage.local.set({ auth: result });
    return result;
}

globalThis.signOut = async function() {
    const logoutUrl = await getLogoutUrl();
    await launchWebAuthFlow(logoutUrl);
}

/**
 * Returns the user signed into the service worker.
 */
 globalThis.getSignedInUser = async function () {
    return new Promise((resolve, reject) => {
        chrome.identity.getProfileUserInfo((user) => {
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    })
}