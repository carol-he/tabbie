/*
This file actually manages the tabs
*/

function stored() {
  storage.get(null, function(items) {
    console.log("FROM tabbie!!: ", items);
  });
}
function sayHello() {
   alert("Hello World")
}
/* TODO: Learn how to put stuff from js into html (possibly use hbs?) */
/* TODO: display tab groups */
/* TODO: allow person to restore all tabs*/
/* TODO: allow person to one tab*/
/* TODO: allow person to a tab group*/
