// background.js
/*
most of the code for user interactions
*/
//using storage API: https://developer.chrome.com/extensions/storage
let storage = chrome.storage.sync;

//context menu - logs click
const allTabs = chrome.contextMenus.create({
    "title": "Save all tabs",
    "id": "all",
    "contexts": ["all"]
});

const pinnedTabs = chrome.contextMenus.create({
    "title": "Save pinned tabs",
    "id": "pinned",
    "contexts": ["all"]
});

const currTab = chrome.contextMenus.create({
    "title": "Save current tab",
    "id": "current",
    "contexts": ["all"]
});

const leftOf = chrome.contextMenus.create({
    "title": "Save all left of this tab",
    "id": "left",
    "contexts": ["all"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log("info: ", info);
  var currentdate = new Date();
  var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  //if statement for each possible 'saves'
  if(info.menuItemId === "all"){
    chrome.tabs.query({ currentWindow: true, active: false }, function (tabs) {
      let ids = [];
      let closed = [];
      for(let i = 0; i < tabs.length; i++){
        //ensure tabbie doesn't close
        if(tabs[i].url !== chrome.extension.getURL('tabbie.html')){
          ids.push(tabs[i].id);
          closed.push(tabs[i]);
        }
      }
      chrome.tabs.remove(ids, function() { });
      storage.set({'tabGroup': closed, 'dateTime': datetime});
      storage.get(null, function(items) {
        console.log("FROM ALL: ", items);
      });
    });
  }
  else if(info.menuItemId === "pinned"){
    chrome.tabs.query({ currentWindow: true, pinned: true }, function (tabs) {
      let ids = [];
      let closed = [];
      for(let i = 0; i < tabs.length; i++){
        console.log(chrome.extension.getURL('tabbie.html'));
        if(tabs[i].url !== chrome.extension.getURL('tabbie.html')){
          ids.push(tabs[i].id);
          closed.push(tabs[i]);
        }
      }
      chrome.tabs.remove(ids, function() { });
      storage.set({'tabGroup': closed, 'dateTime': datetime});
    });
  }
  else if(info.menuItemId === "current"){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if(tabs[i].url !== chrome.extension.getURL('tabbie.html')){
        chrome.tabs.remove(tabs[0].id, function() { });
        storage.set({'tabGroup': tabs, 'dateTime': datetime});
      }
    });
  }
  else if(info.menuItemId === "left"){
    let activeIndex;
    chrome.tabs.query({currentWindow: true, active: true }, function(tabs){
      activeIndex = tabs[0].index;
    });
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      let ids = [];
      let closed = [];
      for(let i = 0; i < activeIndex; i++){
        ids.push(tabs[i].id);
        closed.push(tabs[i]);
      }
      chrome.tabs.remove(ids, function() { });
      storage.set({'tabGroup': closed, 'dateTime': datetime});
    });
  }
});

console.log("Test: ", allTabs);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function() {
  // Send a message to the active tab
  chrome.tabs.query({currentWindow: true, url: chrome.extension.getURL('tabbie.html')}, function(tabs) {
    //makes tabbie active since it's already open
    if(tabs[0] !== undefined){
      chrome.tabs.update(tabs[0].id, {active: true});
    }
    else{
      chrome.tabs.create({ url: chrome.extension.getURL('tabbie.html'), pinned: true });
    }
  });
    //chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
});

//listen for event, then open the new tab
// not using this - it's just for reference. delete later
chrome.runtime.onMessage.addListener(
  //callback function
  function(request, sender, sendResponse) {
    storage.get(null, function(items) {
      console.log("on click: ", items);
    });
    if( request.message === "open_new_tab" ) {
      //get url from content.js
      chrome.tabs.create({"url": request.url});
    }
  });
