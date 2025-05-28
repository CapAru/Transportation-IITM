import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error encrypting password:", error);
        throw new Error("Failed to encrypt password");
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw new Error("Failed to compare password");
    }
};