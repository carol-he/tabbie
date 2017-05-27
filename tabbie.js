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
  storage.get(null, function(items) {
    console.log("FROM ALL: ", items);
    console.log(items.tabGroups);
    if(items.tabGroups){
      //prints group
      console.log(items.tabGroups.length);
      for(let i = 0; i < items.tabGroups.length; i++){
        let date = document.createElement('h2');
        date.textContent = items.tabGroups[i].dateTime;
        console.log("testt");
        document.body.appendChild(date);
        //print tabs in a group
        for(let j = 0; j < items.tabGroups[i].tabGroup.length; j++){
          let tab = document.createElement('a');
          var linkText = document.createTextNode(items.tabGroups[i].tabGroup[j].title);
          tab.appendChild(linkText);
          tab.title = items.tabGroups[i].tabGroup[j].title;
          tab.href = items.tabGroups[i].tabGroup[j].url;
          tab.groupid = i
          console.log('id: ', tab.id);
          tab.id = j;
          tab.addEventListener('click', openTab);
          document.body.appendChild(tab);
          document.body.appendChild(document.createElement("br"));
        }
        document.body.appendChild(document.createElement("br"));
      }
    }
  });
}

function openTab(evt) {
  chrome.tabs.create(null, null);
  console.log('evt.target', evt.target);
  storage.get(null, function(items) {
    //create new object with group info
    tabGroups = items.tabGroups;

    const newGroup =
    {
      'tabGroup': closed,
      'dateTime': datetime
    }
    items.tabGroups.push(newGroup);
    storage.set({'tabGroups': tabGroups});
  });
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
