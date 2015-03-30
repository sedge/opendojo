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

module.exports = {
  ageCalculator: ageCalculator,
  membershipStatusCalculator: membershipStatusCalculator
};