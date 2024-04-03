class RegistrationKey {
    constructor(key_id, key, issuing_date, key_used, privilege_level) {
      this.key_id = key_id;
      this.key = key;
      this.issuing_date = issuing_date;
      this.key_used = key_used;
      this.privilege_level = privilege_level;
    }
  }
  
module.exports = RegistrationKey;
