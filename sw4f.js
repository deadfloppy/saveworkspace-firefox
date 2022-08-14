/**
 *  This is the main logic script for SaveWorkspace4Firefox
 *  By @deadfloppy
 * 
 *  This software is licensed under the MIT License.
 *  Please visit "opensource.org/licenses/MIT" for a copy.
 */

let debugMode = false;

/* DEBUG FUNCTION */
 function download(data, filename) {

    if (debugMode === false) {
        return;
    }

    var file = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

/*
    Collect all tabs into a JSON object and return it
    */
    async function packageTabs() {
       
        let tabArray = await browser.tabs.query({currentWindow: true});
        let tabList = [];
        var counter = 0;
        for (let tab of tabArray) {
           
           let tabUnit = {
               title: tab.title,
               url: tab.url
            };
            
            /*document.getElementById("elements-inside").innerHTML = tab.title;*/
        
            tabList.push(tabUnit);

        }
    return tabList;

}

/*  
    Use textinput field as name,
    Take tab content object from retrieveTabs()
    Set metadata (save file name and date&time)
    Save JSON object into localStorage
    */
   async function saveTabs() {
       console.log("[SW4F] saveTabs() called");
       
       let saveName = document.getElementById("textfield").value;
       if (saveName === "") { 
           /* In case there is no input in textinput field,
           use a sample name. Ideally, this should be handled properly
           TODO: fix naming handling */
           let saveName = "Workspace save file";      
        }
        let saveDate = new Date().toLocaleDateString();
        let content = await packageTabs();
        let saveObject = {name: saveName, date: saveDate, content: content}
        browser.storage.local.set({[saveName] : saveObject}); /* Save the workspace itself */
        
        /* Try getting the save file list. If not, throw an error */
        /*try {*/
            document.getElementById("footer-text-box").innerHTML = "Starting";
            let saveFileList = await browser.storage.local.get("sw4f-list");
            document.getElementById("footer-text-box").innerHTML = Object.values(saveFileList);
            
            document.getElementById("footer-text-box").innerHTML = "Pushed new element into saveFileList";
            browser.storage.local.set({["sw4f-list"] : JSON.stringify(saveFileList)});
            document.getElementById("footer-text-box").innerHTML = "Saved saveFileList into storage";
        /*}
        catch(err) {
            document.getElementById("footer-text-box").innerHTML = "No workspaces found";
        }*/
        updateList();
        
        /* DEBUG */
    let stringObj = JSON.stringify(saveObject);
    download(stringObj, "debugFile.json");
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
    updateList();
    return data;
}

/*
    Use selection from list as save file name,
    Delete it from localStorage,
    Update selection list
*/
function removeTabs(name) {
    let data = browser.storage.local.remove(name);
    updateList();
    return data;
}

/*
    Update the save files list upon any change
    SW4F saves all save file names in local storage,
    as a way to bypass limitations of browser.storage API
*/
async function updateList() {

    let saveFilesList = await browser.storage.local.get("sw4f-list");

    /* Go through every save file name in saveFilesList and create a list element for every one */
    document.getElementById("elements-inside").innerHTML = "<div id=\"elements-list\"> <form action=\"#\"> <select name=\"saveFiles\" id=\"save-file-list\" size=\"4\"> </select> </form> </div>"
    document.getElementById("elements-inside").innerHTML = JSON.stringify(saveFilesList);
    for (let item of saveFilesList) {
        document.getElementById("save-file-list").innerHTML += `<option value=${item}>${item}</option>`
    }
    return;
}

/* DEBUG */
document.getElementById("savebutton").onclick = saveTabs;

try {
    let saveFileList = JSON.parse(browser.storage.local.get("sw4f-list"));
}
catch(err) {
    /*alert("No save file list found in local storage!")*/
    browser.storage.local.set({["sw4f-list"] : "empty"});
}
