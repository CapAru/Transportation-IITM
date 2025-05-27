import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (uid) => {
    return jwt.sign({uid}, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

const generateRefreshToken = (uid) => {
    return jwt.sign({uid}, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export {generateAccessToken, generateRefreshToken}