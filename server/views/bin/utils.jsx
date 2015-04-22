var moment = require('moment');

function momentForTime(time) {
  time = time.split(":");
  var hours = time[0];
  var minutes = time[1];

  var timeInMoment = moment();
  timeInMoment.hours(hours);
  timeInMoment.minutes(minutes);

  if (time.length === 3) {
    timeInMoment.seconds(time[2]);
  } else {
    timeInMoment.seconds("00");
  }

  return timeInMoment;
}

function ageCalculator(bday){
  var birthDate = new Date(bday);
  var today = new Date();

  var years = (today.getFullYear() - birthDate.getFullYear());
  if (today.getMonth() < birthDate.getMonth() ||
        today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate()) {
        years--;
    }

  return years;
}

function validateExpiryDate(memdate) {
  var today = new Date();
  var expiry = new Date(memdate);
  var maxYear =  today.getFullYear() + 2;
  var aDay = 24 * 60 * 60 * 1000;

  if(Date.parse(memdate) < Date.now() - aDay || expiry.getFullYear() > maxYear) {
    return false;
  }
  else return true;
}

function timeFormatting(time){
  if(time.split(':')[1].length == 1){
        return time.split(":")[0]+":0" + time.split(':')[1];
  }
  else{
    return time.split(":")[0]+":" + time.split(':')[1];
  }
}

function sortByKey(property,desc) {
  if (desc) {
    return function (a, b) {
      if(typeof a[property] == "string"){
        var x = a[property].toLowerCase();
        var y = b[property].toLowerCase();
      }
      else{
        var x = a[property];
        var y = b[property];
      }
      return (x > y) ? -1 : (x< y) ? 1 : 0;
    }
  }
  return function (a, b) {
      if(typeof a[property] == "string"){
        var x = a[property].toLowerCase();
        var y = b[property].toLowerCase();
      }
      else{
        var x = a[property];
        var y = b[property];
      }
    return (x < y) ? -1 : (x > y) ? 1 : 0;
  }
}

function membershipStatusCalculator(exDate){
  var status;
  var expireDate = new Date(exDate);
  var today = new Date();
  var restDays = Math.floor((expireDate.getTime()-today.getTime())/(24 * 60 * 60 * 1000));
  if(expireDate-today > 0){
    status = "Available (" + restDays +" days left)";
  }
  else {status = "Expired";}
  return status;
}

function bdateForEdit(date){
  var bdate = new Date(date);
  var yyyy = bdate.getFullYear().toString();
  var mm = (bdate.getMonth()+1).toString();
  var dd  = (bdate.getDate()).toString();
  var dd  = bdate.getDate().toString();

  // CONVERT mm AND dd INTO chars
  var mmChars = mm.split('');
  var ddChars = dd.split('');

  // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Template logic source: https://gist.github.com/James1x0/8443042
function getGreetingTime (moment) {
  var greeting = null;

  //if we can't find a valid or filled moment, we return.
  if(!moment || !moment.isValid()) {
    return;
  }

  var split_afternoon = 12 //24hr time to split the afternoon
  var split_evening = 18 //24hr time to split the evening
  var currentHour = parseFloat(moment.format("HH"));

  if(currentHour >= split_afternoon && currentHour <= split_evening) {
    greeting = "afternoon";
  }
  else if(currentHour >= split_evening) {
    greeting = "evening";
  }
  else {
    greeting = "morning";
  }

  return greeting;
}

module.exports = {
  ageCalculator: ageCalculator,
  validateExpiryDate: validateExpiryDate,
  membershipStatusCalculator: membershipStatusCalculator,
  bdateForEdit: bdateForEdit,
  sortByKey: sortByKey,
  capitalizeFirstLetter: capitalizeFirstLetter,
  timeFormatting: timeFormatting,
  getGreetingTime: getGreetingTime,
  momentForTime: momentForTime
};
