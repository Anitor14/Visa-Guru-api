const e = require("express");
const { statusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    //set default
    statusCode: err.statusCode || statusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
};
