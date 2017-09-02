/*
This file actually manages the tabs
*/
let storage = chrome.storage.sync;

function stored() {
  storage.get(null, function(items) {
    console.log("FROM tabbie!!: ", items);
  });
}
// function sayHello() {
//    alert("Hello World")
// }
function loadTabs() {
  //all items in an array
  storage.get(null, function(items) {
    console.log("FROM ALL: ", items);
    console.log("all items in tabgroups: ", items.tabGroups);
    if(items.tabGroups){
      //prints group
      console.log("number of tabgroups: ", items.tabGroups.length);
      //loop through all tabs??
      for(let i = 0; i < items.tabGroups.length; i++){
        let group = document.createElement('div');
        let groupName = document.createElement('div');
        group.className = "tabGroup";
        groupName.textContent = items.tabGroups[i].dateTime;
        let groupNum = "group" + i;
        group.id = groupNum;
        document.body.querySelector("#list").appendChild(group).appendChild(groupName);
        //print tabs in a group
        for(let j = 0; j < items.tabGroups[i].tabGroup.length; j++){
          let tab = document.createElement('div');
          //the title div of the tab in tab
          let ttitle = document.createElement('div');
          //favicon part of the tab
          let tabFavicon = document.createElement('div');
          tab.className = 'tab';
          ttitle.className = 'title';
          tabFavicon.className = 'favicon';
          console.log("faviconUrl: ", items.tabGroups[i].tabGroup[j].favIconUrl);
          tabFavicon.style.backgroundImage = 'url(' + items.tabGroups[i].tabGroup[j].favIconUrl + ')';
          var linkText = document.createTextNode(items.tabGroups[i].tabGroup[j].title);
          ttitle.title = items.tabGroups[i].tabGroup[j].title;
          ttitle.textContent = ttitle.title;
          tab.href = items.tabGroups[i].tabGroup[j].url;
          tab.groupid = i;
          tab.id = items.tabGroups[i].tabGroup[j].id;
          console.log('id: ', tab.id);
          tab.className = "tab";
          tab.appendChild(ttitle);
          tab.appendChild(tabFavicon);
          tab.addEventListener('click', openTab);
          document.body.querySelector("#" + groupNum).appendChild(tab);
          document.body.appendChild(document.createElement("br"));
        }
        document.body.appendChild(document.createElement("br"));
      }
    }
  });
}

function openTab(evt) {
  let tabObject = evt.target.closest('.tab');
  console.log(tabObject.href);
  let urlString = tabObject.href;
  let number = -2;
  chrome.tabs.create({'url': urlString}, function(tab){

  });
  console.log('evt.target', evt.target);
  //get the group
  //remove one in the group

  // //remove an entire group
  // storage.remove(tabObject.id, function(err){
  //   console.log("err: ", err);
  // });
  tabObject.style = "display:none";
}

function saveAll(){
  event.preventDefault();
  var currentdate = new Date();
  var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  console.log('hi');
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
    url = "chrome://extensions";
    chrome.tabs.create({ url: chrome.extension.getURL(url), active: false });
    if (closed.length > 0) {
      storage.get(null, function(items) {
        //create new object with group info
        tabGroups = items.tabGroups;
        let newGroup =
        {
          'tabGroup': closed,
          'dateTime': datetime
        }
        items.tabGroups.push(newGroup);
        storage.set({'tabGroups': tabGroups});
      });
    }
  });
}
function savePinned(){
  var currentdate = new Date();
  var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  event.preventDefault();

}
function restoreAll(){
  event.preventDefault();

}

function main(){
  loadTabs();
  document.querySelector('#saveall').addEventListener('click', saveAll);
  document.querySelector('#savepinned').addEventListener('click', savePinned);
  document.querySelector('#restoreall').addEventListener('click', restoreAll);
}

document.addEventListener('DOMContentLoaded', main);


/* [x] TODO: Learn how to put stuff from js into html (possibly use hbs?) */
/* [x] TODO: display tab groups */
/* [ ] TODO: allow person to restore all tabs*/
/* [ ] TODO: allow person to restore one tab*/
/* [ ] TODO: allow person to restore a tab group*/
