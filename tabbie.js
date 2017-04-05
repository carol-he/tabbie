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
storage.get(null, function(items) {
  console.log("FROM ALL: ", items);
  console.log(items);
  console.log(items.tabGroups);
  if(items.tabGroups){
    console.log("testt");
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
        document.body.appendChild(tab);
        document.body.appendChild(document.createElement("br"));
      }
      document.body.appendChild(document.createElement("br"));
    }
  }
});

//document.getElementById("list").innerHTML = "<p>Error.</p>";
/* TODO: Learn how to put stuff from js into html (possibly use hbs?) */
/* TODO: display tab groups */
/* TODO: allow person to restore all tabs*/
/* TODO: allow person to one tab*/
/* TODO: allow person to a tab group*/
