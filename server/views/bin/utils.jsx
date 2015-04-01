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

<<<<<<< HEAD
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

module.exports = {
  bdateForEdit: bdateForEdit,
  ageCalculator: ageCalculator,
  membershipStatusCalculator: membershipStatusCalculator
};
=======
module.exports = {
  ageCalculator: ageCalculator,
  membershipStatusCalculator: membershipStatusCalculator
};
>>>>>>> 2428558437bc01510cc3be6fced2fd4da9ce4985
