chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.executeFn === "signIn") {
        sendResponse(await globalThis.signIn());
    } else if (request.executeFn === "signOut") {
        globalThis.signOut();
        sendResponse(null);
    } else if (request.executeFn === "getSignedInUser") {
        sendResponse(await globalThis.getSignedInUser());
    }
    return true; // must return true for async listeneres
});
