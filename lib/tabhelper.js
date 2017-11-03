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
                + second + " " + ext;
                // + ":" + currentdate.getSeconds();
  return datetime;
}

module.exports = {
  saveTabs: saveTabs,
  saveCurrTab: saveCurrTab,
  createTabbie: createTabbie,
  getDateString: getDateString
};
