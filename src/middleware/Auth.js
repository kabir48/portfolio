const { DecodeToken } = require("../helper/AuthToken.js");// Import your token decoding function

const loggedInUser = (req, res, next) => {
    // Extract token from headers or cookies
    let token = req.headers["token"] ? req.headers["token"] : req.cookies["token"];

    // Decode the token
    let decodeToken = DecodeToken(token);

    // Check if the token is valid
    if (decodeToken == null) {
        // If token is invalid, return unauthorised error
        res.status(401).json({
            status: "fail",
            message: "Unauthorized"
        });
    } else {
        // If token is valid, extract user information from the token
        let email = decodeToken["email"];
        let user_id = decodeToken["user_id"];

        // Set user information in the request object
        req.loggedInUser = {
            email: email,
            id: user_id
        };

        // Call next middleware or controller function
        next();
    }
};

module.exports = loggedInUser;