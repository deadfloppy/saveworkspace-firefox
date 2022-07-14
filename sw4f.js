/**
 *  This is the main logic script for SaveWorkspace4Firefox
 *  By @deadfloppy
 * 
 *  This software is licensed under the MIT License.
 *  Please visit "opensource.org/licenses/MIT" for a copy.
 */

/* Save current tabs into memory */
function saveWorkspace() {
    return;
}
/* Load a workspace from memory into current browser window*/
function loadWorkspace(workspace) {
    return;
}

function doshit(bruh) {
    for (let tab of bruh) {
        console.log(tab.url);
    }
}

function onError(error) {
    console.log(`[ERROR] ${error}`);
}

/**
 *  First function to be run.
 *  Loads the workspace list from memory and sets up the interface
 */
function initialize() {
    console.log("[SW4F] Initalizing...");
    
    
    return;
    
}


initialize();
browser.tabs.query({currentWindow:true})
.then((tabs) => {
    for (let tab in tabs) {
        console.log(tab.url);
    }
});