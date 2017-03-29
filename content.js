// content.js
//
// const bkg = chrome.runtime.getBackgroundPage();
// bkg.console.log("hello from bg: ", chrome.tabs);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      //grabs first link on page
      let firstHref = $("a[href^='http']").eq(0).attr("href");
      //let currentTabID = chrome.tabs[0].id;
      console.log("firstHref:", firstHref);
      //console.log("tab id:", currentTabID);

      // This line is new!
      //chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
      chrome.runtime.sendMessage({"message": "closeAll"});
      //console.log("CHROME: ", chrome.tabs.getCurrent());
      //console.log(chrome.tabs.query(object queryInfo, function callback));
    }
  });
