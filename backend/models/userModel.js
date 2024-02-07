class User {
    constructor(employeeId, firstName, lastName, email, birthDate, password, privilegeLevel) {
      this.employeeId = employeeId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.birthDate = birthDate;
      this.password = password;
      this.privilegeLevel = privilegeLevel;
    }
  }
  
  module.exports = User;
  