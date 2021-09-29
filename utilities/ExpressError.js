// making class to give predefined msg and status
//codes and to keep them explicit as before

class ExpressError extends Error {
  //making error construcxtor function
  constructor(message, statuscode) {
    super();
    this.message = message;
    this.statuscode = statuscode;
  }
}

module.exports = ExpressError;
