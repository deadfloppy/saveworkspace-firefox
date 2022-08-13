/**
 *  This is the main logic script for SaveWorkspace4Firefox
 *  By @deadfloppy
 * 
 *  This software is licensed under the MIT License.
 *  Please visit "opensource.org/licenses/MIT" for a copy.
 */

function getAllTabs() {
    return browser.tabs.query({currentWindow: true});
}

/* Save current tabs into memory */
function saveWorkspace(tabArray) {

    let tabList = [];
    var counter = 0;
    for (tab of tabArray) {
        
        let tabUnit = {
            "title": tab.title,
            "url": tab.url
        };

        tabList.push(tabUnit);
        counter++;

    }

    var tabObject = JSON.stringify(tabList);
    saveTabs(tabObject);
    return;

}

/*  
    Use textinput field as name,
    Parse tabs' name, url, into a JSON object,
    Parse name, time, date into the same JSON object,
    Save JSON object into localStorage
*/
function saveTabs(content) {
    let saveName = document.getElementById("textfield");
    if (saveName === "") { 
        /* In case there is no input in textinput field,
            use a sample name. Ideally, this should be handled properly */
        let saveName = "Workspace save file";      
    }
    browser.storage.local.set({[saveName] : content});
    return;
}

/*
    Use selection from list as name for save file,
    Load save file from JSON storage,
    Load tabs one by one,
    Keep save file in localStorage
*/
function loadTabs() {
    var date = new Date();
    var saveName = "Save: " + date.toLocaleDateString();
    let data = browser.storage.local.get(saveName)
    .then(JSON.stringify);
    return data;
}

/*
    Use selection from list as save file name,
    Delete it from localStorage,
    Update selection list
*/
function removeTabs(name) {
    let data = browser.storage.local.remove(name);
    return data;
}

function doshit(bruh) {
    var label = document.getElementById("workspace-element");
    label.innerHTML = bruh;
    return;
}

function onError(error) {
    doshit(error);
    return;
}

/**
 *  First function to be run.
 *  Loads the workspace list from memory and sets up the interface
 */
function initialize() {
    var raw_prevStoredData = browser.storage.local.get(null)
    .then(JSON.stringify);

    return;
}

console.log("[SW4F] sw4f.js started running...");
var data = getAllTabs().then(saveWorkspace);
saveTabs(data);
let pp = loadTabs();
pp.then(doshit);

/* Connecting UI to script */
let loadButton = document.getElementById("loadbutton").onclick;
loadButton = {} => {
    return;
};

document.getElementById("savebutton").onclick = saveTabs();

