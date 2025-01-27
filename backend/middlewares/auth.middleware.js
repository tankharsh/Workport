const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET; // Ensure this matches the key used to sign the token

module.exports.authUser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Validate the presence of the Authorization header
    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    // Extract token from the Authorization header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Token missing" });
    }

    // Verify token and attach the user to the request object
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
