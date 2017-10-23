// background.js
/*
most of the code for user interactions
*/
//using storage API: https://developer.chrome.com/extensions/storage
storage = chrome.storage.sync;
const helper = require('../tabhelper.js');
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

const rightOf = chrome.contextMenus.create({
  "title": "Save all right of this tab",
  "id": "right",
  "contexts": ["all"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log("info: ", info);
  //if statement for each possible 'saves'
  if(info.menuItemId === "all"){
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      helper.saveTabs(tabs);
    });
    helper.createTabbie();
  }
  else if(info.menuItemId === "pinned"){
    chrome.tabs.query({currentWindow: true, pinned: true}, function (tabs) {
      helper.saveTabs(tabs);
    });
    helper.createTabbie();
  }
  else if(info.menuItemId === "current"){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      helper.saveCurrTab(tabs);
    });
    helper.createTabbie();
  }
  else if(info.menuItemId === "left"){
    let activeIndex;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      activeIndex = tabs[0].index;
    });
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const leftTabs = [];
      for(let i = 0; i < activeIndex; i++){
        leftTabs.push(tabs[i]);
      }
      helper.saveTabs(leftTabs);
    });
    helper.createTabbie();
  }
  else if(info.menuItemId == "right"){
    let activeIndex;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      activeIndex = tabs[0].index;
    });
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const rightTabs = [];
      for(let i = activeIndex; i < tabs.length; i++){
        rightTabs.push(tabs[i]);
      }
      helper.saveTabs(rightTabs);
    });
    helper.createTabbie();
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
});
