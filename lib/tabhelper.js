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
  getDateString: getDateString;
};
