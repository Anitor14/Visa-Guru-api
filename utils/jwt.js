const jwt = require("jsonwebtoken");

// creating the JWT token from the payload.
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user }); //creates a token

  const oneDay = 1000 * 60 * 60 * 24; // getting milliseconds of a day.

  // this is the process of attaching cookies in the response
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    // signed: true,
  });
  return token;
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
