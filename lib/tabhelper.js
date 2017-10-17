function saveAll(){
  event.preventDefault();
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    saveTabs(tabs);
  });
}
function savePinned(){
  event.preventDefault();
  chrome.tabs.query({ currentWindow: true, pinned: true}, function (tabs) {
    saveTabs(tabs);
  });
}

function saveTabs(tabs){
  const datetime = getDateString();
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
}

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

module.exports = {
  saveAll: saveAll,
  savePinned: savePinned,
  saveTabs: saveTabs,
  getDateString: getDateString
};
