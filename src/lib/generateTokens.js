import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = async (uid, isAdmin) => {
    return jwt.sign({uid, isAdmin}, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const generateRefreshToken = async (uid, isAdmin) => {
    return jwt.sign({uid, isAdmin}, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export {generateAccessToken, generateRefreshToken}