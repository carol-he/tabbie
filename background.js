// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

//listen for event, then open the new tab
chrome.runtime.onMessage.addListener(
  //callback function
  function(request, sender, sendResponse) {
    // if( request.message === "open_new_tab" ) {
    //   //get url from content.js
    //   chrome.tabs.create({"url": request.url});
    // }
    if( request.message === "closeAll" ) {
      // chrome.tabs.getCurrent(function(tab) {
      //   console.log("c", tab);
      //   chrome.tabs.remove(tab.id, function() { });
      // });
      chrome.tabs.query({ currentWindow: true, active: false }, function (tabs) {
        console.log(tabs);
        let ids = [];
        for(let i = 0; i < tabs.length; i++){
          ids.push(tabs[i].id);
        }
        chrome.tabs.remove(ids, function() { });
      });
    }
    if( request.message === "closeCurrent" ) {
      // chrome.tabs.getCurrent(function(tab) {
      //   console.log("c", tab);
      //   chrome.tabs.remove(tab.id, function() { });
      // });
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0]);
        console.log(tabs[0].id);
        chrome.tabs.remove(tabs[0].id, function() { });
      });
    //    chrome.tabs.remove("currentTabID": request.currentTabID);
    }
  });
