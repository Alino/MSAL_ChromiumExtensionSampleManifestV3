/**
 * Adds a sign in button for the user signed into the browser
 */
 chrome.runtime.sendMessage({executeFn: "getSignedInUser"}, async (user) => {
    if (user) {
        const signInHintButton = document.getElementById("sign-in-hint");
        signInHintButton.innerHTML = `Sign In (w/ ${user.email})`;
        signInHintButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({executeFn: "signIn"}, (response) => {
                document.getElementById("username").innerHTML = response.account.username;
            });
        });
        signInHintButton.classList.remove("hidden");
    }
 });


/**
 * Sign in button
 */
document.getElementById("sign-in").addEventListener("click", () => {
    chrome.runtime.sendMessage({executeFn: "signIn"}, (response) => {
        document.getElementById("username").innerHTML = response.account.username;
    });
});

/**
 * Sign out button
 */
document.getElementById("sign-out").addEventListener("click", () => {
    document.getElementById("username").innerHTML = "";
    document.getElementById("displayname").innerHTML = "";
    
    chrome.runtime.sendMessage({executeFn: "signOut"}, (response) => {
        document.getElementById("username").innerHTML = response.account.username;
    });
});