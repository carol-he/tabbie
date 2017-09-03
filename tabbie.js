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
    console.log("all items in tabgroups: ", items);
    if(items){
      //prints group
      console.log("number of tabgroups: ", items.length);
      //loop through all tabgroups
      let arr = [];
      for(var date in items){
        arr.push(date);
      }
      for(let i = arr.length-1; i >= 0; i--){
        let date = arr[i];
        let group = document.createElement('div');
        let groupName = document.createElement('div');
        group.className = "tabGroup";
        groupName.textContent = date;
        document.body.querySelector("#list").appendChild(group).appendChild(groupName);
        //print tabs in a group
        console.log(date);
        let tabGroup = items[date].tabGroup;
        console.log(tabGroup);
        for(let j = 0; j < tabGroup.length; j++){
          let tab = document.createElement('div');
          //the title div of the tab in tab
          let title = document.createElement('div');
          //favicon part of the tab
          let tabFavicon = document.createElement('div');
          tab.className = 'tab';
          title.className = 'title';
          tabFavicon.className = 'favicon';
          console.log("faviconUrl: ", tabGroup[j].favIconUrl);
          tabFavicon.style.backgroundImage = 'url(' + tabGroup[j].favIconUrl + ')';
          var linkText = document.createTextNode(tabGroup[j].title);
          title.title = tabGroup[j].title;
          title.textContent = title.title;
          tab.href = tabGroup[j].url;
          tab.id = tabGroup[j].id;
          console.log('id: ', tab.id);
          tab.className = "tab";
          tab.appendChild(title);
          tab.appendChild(tabFavicon);
          let data = {};
          data.date = date;
          data.url = tab.href;
          console.log(data);
          tab.addEventListener('click', openTab(data));
          document.body.querySelector('.tabGroup:last-child').appendChild(tab);
          document.body.appendChild(document.createElement("br"));
        }
        document.body.appendChild(document.createElement("br"));
      }
    }
  });
}

function openTab(data) {
  //closure to retain data
  return function(evt){
    let tabObject = evt.target.closest('.tab');
    console.log("tabobject href: ", tabObject.href);
    let urlString = tabObject.href;
    chrome.tabs.create({'url': urlString}, function(tab){
      //get the group
      //remove one in the group
      console.log("data: ", data);
      storage.get(data.date, function(items) {
        let date = data.date;
        console.log("items: ", items[date]);
        let update = [];
        let removed = 0;
        for(let i = 0; i < items[date].tabGroup.length; i++){
          console.log("cur url: ", items[date].tabGroup[i].url);
          if(items[date].tabGroup[i].url !== urlString || removed == 1){
            update.push(items[date].tabGroup[i]);
            console.log("YES");
          } else {
            removed = 1;
          }
        }
        if (update.length > 0) {
          //create new object with group info
          //tabGroups = items.tabGroups;
          let newGroup =
          {
            'tabGroup': update,
            'dateTime': data.date
          }
          let obj = {};
          obj[data.date] = newGroup;
          //items.tabGroups.push(newGroup);
          storage.set(obj);
        } else {
          //remove group
          storage.remove(data.date);
        }
      });
    });
    //update client side maybe reload instead
    tabObject.style = "display:none";
  }
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
