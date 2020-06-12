const logger = require("@logs/logger");

module.exports = (message,status,next,error) => {
  logger.error({
      error
  });
  next();
};