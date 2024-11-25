const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const secretKey = process.env.SECRET_KEY;

const GenerateToken = async (username, email, password) => {
    const token = await jwt.sign({ username, email, password }, secretKey);
    console.log("token", token);
    return token;
};

const VerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log('authHeader', authHeader);
    const token = authHeader;
    //   console.log('token', token);

    if (!token) {
        return res.status(400).send("unauthorized");
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(400).send("no valid token");
        }
        req.user = user;
        next();
    });
};

module.exports = { GenerateToken, VerifyToken };
