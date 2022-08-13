/**
 *  This is the main logic script for SaveWorkspace4Firefox
 *  By @deadfloppy
 * 
 *  This software is licensed under the MIT License.
 *  Please visit "opensource.org/licenses/MIT" for a copy.
 */

/* DEBUG FUNCTION */
 function download(data, filename) {
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
   function retrieveTabs(tabArray) {
       
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
    return JSON.stringify(tabList);

}

/*  
    Use textinput field as name,
    Take tab content object from retrieveTabs()
    Set metadata (save file name and date&time)
    Save JSON object into localStorage
    */
   function saveTabs() {
       console.log("[SW4F] saveTabs() called");
       
       let saveName = document.getElementById("textfield").value;
       if (saveName === "") { 
           /* In case there is no input in textinput field,
           use a sample name. Ideally, this should be handled properly
           TODO: fix naming handling */
           let saveName = "Workspace save file";      
        }
        let saveDate = 0;
        let content = browser.tabs.query({currentWindow: true}).then(retrieveTabs);
        document.getElementById("elements-inside").innerHTML = content;
        let saveObject = {name: saveName, date: saveDate, content: content}
        browser.storage.local.set({[saveName] : saveObject});
        updateList();
        
        /* DEBUG */
    let stringObj = JSON.stringify(saveObject);
    /*download(stringObj, "debugFile.json");*/
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
    TODO: finish this
*/
function updateList() {
    return;
}

/* DEBUG */
document.getElementById("savebutton").onclick = saveTabs;
