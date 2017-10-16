// background.js
/*
most of the code for user interactions
*/
//using storage API: https://developer.chrome.com/extensions/storage
let storage = chrome.storage.sync;
storage.clear();
// const getDateString = require('tabhelper.js').getDateString;
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
  var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  //if statement for each possible 'saves'
  if(info.menuItemId === "all"){
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      let ids = [];
      let closed = [];
      let exist = 0;
      for(let i = 0; i < tabs.length; i++){
        //ensure tabbie doesn't close
        if(tabs[i].url !== chrome.extension.getURL('tabbie.html')){
          ids.push(tabs[i].id);
          closed.push(tabs[i]);
        } else {
          exist = 1;
        }
      }
      if(exist == 0){
        chrome.tabs.create({ url: chrome.extension.getURL('tabbie.html'), pinned: true });
      }
      chrome.tabs.remove(ids, function() { });
      chrome.tabs.reload();
      // url = "chrome://extensions";
      // chrome.tabs.create({ url: chrome.extension.getURL(url), active: false });
      if (closed.length > 0) {
        storage.get(null, function(items) {
          //create new object with group info
          //tabGroups = items.tabGroups;
          let newGroup =
          {
            'tabGroup': closed,
            'dateTime': datetime
          }
          let obj = {};
          obj[datetime] = newGroup;
          //items.tabGroups.push(newGroup);
          storage.set(obj);
        });
      }
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
      chrome.tabs.reload();
      if (closed.length > 0) {
        storage.get(null, function(items) {
          //create new object with group info
          tabGroups = items.tabGroups;
          let newGroup =
          {
            'tabGroup': closed,
            'dateTime': datetime
          }
          let obj = {};
          obj[datetime] = newGroup;
          storage.set(obj);
        });
      }
    });
  }
  else if(info.menuItemId === "current"){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if(tabs[0].url !== chrome.extension.getURL('tabbie.html')){
        let closed = [tabs[0]];
        chrome.tabs.remove(tabs[0].id, function() { });
        storage.get(null, function(items) {
          //create new object with group info
          tabGroups = items.tabGroups;
          let newGroup =
          {
            'tabGroup': closed,
            'dateTime': datetime
          }
          let obj = {};
          obj[datetime] = newGroup;
          storage.set(obj);
        });
      }
    });
  }
  else if(info.menuItemId === "left"){
    let activeIndex;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      activeIndex = tabs[0].index;
    });
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      let ids = [];
      let closed = [];
      for(let i = 0; i < activeIndex; i++){
        if(tabs[i].url !== chrome.extension.getURL('tabbie.html')){
          ids.push(tabs[i].id);
          closed.push(tabs[i]);
        }
      }
      chrome.tabs.remove(ids, function() { });
      if (closed.length > 0) {
        storage.get(null, function(items) {
          //create new object with group info
          tabGroups = items.tabGroups;
          let newGroup =
          {
            'tabGroup': closed,
            'dateTime': datetime
          }
          let obj = {};
          obj[datetime] = newGroup;
          storage.set(obj);;
        });
      }
    });
  }
});

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
  function getDateString(){
    var currentdate = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let ext = "am";
    let hour = currentdate.getHours();
    if(parseInt(currentdate.getHours()) > 12){
      ext = "pm";
      hour = currentdate.getHours() - 12;
    }
    var datetime = months[currentdate.getMonth()] + " "
                  + currentdate.getDate()  + ", "
                  + currentdate.getFullYear() + " at "
                  + hour + ":"
                  + currentdate.getMinutes()
                  + " " + ext;
                  // + ":" + currentdate.getSeconds();
    return datetime;
  }
