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
          tab.groupid = i;
          console.log('id: ', tab.id);
          tab.id = items.tabGroups[i].tabGroup[j].id;
          tab.className = "tab";
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
  event.preventDefault();
  chrome.tabs.create({}, function(tab){

  });
  console.log('evt.target', evt.target);
  //get the group
  //remove one in the group
  // storage.remove(null, function(items){
  //
  // });
  //remove on client
  $(function() {
      $(evt.target).empty();
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
