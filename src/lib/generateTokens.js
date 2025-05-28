import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = async (uid) => {
    return jwt.sign({uid}, ACCESS_TOKEN_SECRET, { expiresIn: "2m" });
}

const generateRefreshToken = async (uid) => {
    return jwt.sign({uid}, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export {generateAccessToken, generateRefreshToken}