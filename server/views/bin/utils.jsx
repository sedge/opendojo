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
      }else{
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
  }else {status = "Expired";}
  return status;
}

function bdateForEdit(date){
  var bdate = new Date(date);
  var yyyy = bdate.getFullYear().toString();
  var mm = (bdate.getMonth()+1).toString();
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

module.exports = {
  ageCalculator: ageCalculator,
  membershipStatusCalculator: membershipStatusCalculator,
  bdateForEdit: bdateForEdit,
  sortByKey: sortByKey,
  capitalizeFirstLetter: capitalizeFirstLetter
};
