// a workaround for msal not being able to detect browser environment
const JSDOM = new jsdomModule.JSDOM;
globalThis.window = JSDOM.window;
globalThis.document = globalThis.window.document;

delete globalThis.window.crypto;
globalThis.window.msCrypto = msrCrypto;

delete globalThis.window.localStorage;

let storage = {};

chrome.storage.local.get(null).then((wholeStorage) => {
    storage = wholeStorage;
});

chrome.storage.onChanged.addListener(updatedStorage => {
    Object.keys(updatedStorage).forEach(key => {
        storage[key] = updatedStorage[key].newValue;
    });
});

// a workaround for msal not supporting chrome.storage API as a cache option
globalThis.localStorage = {
    setItem: (key, value) => {
        console.log(`setting chrome.storage key ${key} with value ${value}`);
        chrome.storage.local.set({ [`localStorage-${key}`]: value });
    },
    getItem: (key) => {
        console.log(`getting chrome.storage key ${key}`);
        return storage[`localStorage-${key}`];
    },
    removeItem: (key) => {
        console.log(`removing chrome.storage key ${key}`);
        chrome.storage.local.remove([`localStorage-${key}`]);
    },
    clear: () => {
        console.log(`clearing chrome.storage`);
        chrome.storage.local.clear();
        storage = {};
    },
    getKeys: () => {
        console.log('customStorage getKeys()');
        var items = storage;
        var allKeys = Object.keys(items);
        console.log(allKeys);
        return allKeys;
    },
    containsKey(key) {
        console.log('customStorage containsKey()', key);
        return storage[key] !== undefined;
    }
}
globalThis.window.localStorage = {};
globalThis.window.localStorage = globalThis.localStorage;
