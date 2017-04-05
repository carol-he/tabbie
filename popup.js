function awesome() {
  // Do something awesome!
}

function totallyAwesome() {
  // do something TOTALLY awesome!
}

function awesomeTask() {
  awesome();
  totallyAwesome();
}

function clickHandler(e) {
  setTimeout(awesomeTask, 1000);
  alert('Hello world');
}

function main() {
  // Initialization work goes here.
}
// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
// document.write("HELLO");
// document.getElementById("tab list").innerHTML = 5 + 6;
document.addEventListener('DOMContentLoaded', function () {
  const x = document.querySelector('button');
  if(x){
    x.addEventListener('click', clickHandler);
  }
  main();
});
