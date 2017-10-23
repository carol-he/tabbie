(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../tabhelper.js":2}],2:[function(require,module,exports){
function saveTabs(tabs){
  const datetime = getDateString();
  const ids = [];
  const closed = [];
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
    chrome.tabs.create({ url: chrome.extension.getURL('tabbie.html'), pinned: true, active: true});
  }
  chrome.tabs.remove(ids, function() { });
  chrome.tabs.reload();
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
}

function saveCurrTab(tabs){
  const datetime = getDateString();
  if(tabs[0].url !== chrome.extension.getURL('tabbie.html')){
    let closed = [tabs[0]];
    chrome.tabs.remove(tabs[0].id, function() { });
    chrome.tabs.reload();
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
}

function createTabbie(){
  chrome.tabs.query({index: 0, currentWindow: true }, function(tabs){
    if(tabs[0].url !== chrome.extension.getURL('tabbie.html')){
      chrome.tabs.create({ url: chrome.extension.getURL('tabbie.html'), index: 0, pinned: true, active: true, currentWindow: true });
    } else {
      chrome.tabs.update(tabs[0].id, {active: true}, function(){
        chrome.tabs.reload();
      });
    }
  });
}

function getDateString(){
  var currentdate = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let ext = "am";
  let hour = (currentdate.getHours()<10?'0':'') + currentdate.getHours();
  let minute = (currentdate.getMinutes()<10?'0':'') + currentdate.getMinutes();
  let second = (currentdate.getSeconds()<10?'0':'') + currentdate.getSeconds();
  if(parseInt(currentdate.getHours()) > 12){
    ext = "pm";
    hour = currentdate.getHours() - 12;
  }
  else if(parseInt(currentdate.getHours()) === 0){
    hour = 12;
  }
  var datetime = months[currentdate.getMonth()] + " "
                + currentdate.getDate()  + ", "
                + currentdate.getFullYear() + " at "
                + hour + ":"
                + minute + ":"
                + seconds + " " + ext;
                // + ":" + currentdate.getSeconds();
  return datetime;
}

module.exports = {
  saveTabs: saveTabs,
  saveCurrTab: saveCurrTab,
  createTabbie: createTabbie,
  getDateString: getDateString
};

},{}]},{},[1]);
