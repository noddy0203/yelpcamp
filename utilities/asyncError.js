module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

//this utitlity is to catch error from async functions
//then we dont need to use try catch module in async routes
